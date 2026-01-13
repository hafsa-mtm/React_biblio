import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LivreAPI } from "../../api/livre.api";
import { Book } from "../../types/Book";
import { ArrowLeft, BookOpen, Upload, Save, CheckCircle, XCircle, Info } from "lucide-react";

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    genre: "",
    isbn: "",
    numPages: 0,
    numChapters: 0,
    numTotalLivres: 0,
    synopsis: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isbnError, setIsbnError] = useState<string>("");
  const [isbnValid, setIsbnValid] = useState<boolean>(false);

  const validateISBN = (isbn: string): { isValid: boolean; formatted: string; error: string } => {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const regex = /^[0-9]{13}$/;
    
    if (!regex.test(cleanISBN)) {
      return {
        isValid: false,
        formatted: isbn,
        error: "ISBN invalide. Format attendu : 13 chiffres (ex: 9782070368228)"
      };
    }

    const formatted = cleanISBN.replace(/^(\d{3})(\d{2})(\d{5})(\d{3})$/, '$1-$2-$3-$4');
    
    return {
      isValid: true,
      formatted,
      error: ""
    };
  };

  const formatISBNInput = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 13);
    
    if (limited.length <= 3) return limited;
    if (limited.length <= 5) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    if (limited.length <= 10) return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5)}`;
    return `${limited.slice(0, 3)}-${limited.slice(3, 5)}-${limited.slice(5, 10)}-${limited.slice(10, 13)}`;
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!id) return;

        const data: Book = await LivreAPI.getById(Number(id));
        setBook(data);

        setFormData({
          titre: data.titre,
          auteur: data.auteur || "",
          genre: data.genre || "",
          isbn: data.isbn,
          numPages: data.numPages || 0,
          numChapters: data.numChapters || 0,
          numTotalLivres: data.numTotalLivres || 0,
          synopsis: data.synopsis || "",
          image: null,
        });

        // Valider l'ISBN initial
        if (data.isbn) {
          const validation = validateISBN(data.isbn);
          setIsbnValid(validation.isValid);
          setIsbnError(validation.error);
        }
      } catch {
        setError("Erreur lors du chargement du livre");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "isbn") {
      const formattedValue = formatISBNInput(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }));

      const cleanValue = formattedValue.replace(/[-\s]/g, '');
      if (cleanValue.length === 13) {
        const validation = validateISBN(formattedValue);
        setIsbnValid(validation.isValid);
        setIsbnError(validation.error);
        
        if (validation.isValid) {
          setFormData(prev => ({
            ...prev,
            isbn: validation.formatted,
          }));
        }
      } else {
        setIsbnValid(false);
        setIsbnError(cleanValue.length > 0 ? "L'ISBN doit contenir exactement 13 chiffres" : "");
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes("num") ? Number(value) : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, image: file }));

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const validation = validateISBN(formData.isbn);
    if (!validation.isValid) {
      setIsbnError(validation.error || "ISBN invalide");
      setIsbnValid(false);
      setSaving(false);
      return;
    }

    try {
      const data = new FormData();

      data.append("titre", formData.titre);
      data.append("auteur", formData.auteur);
      data.append("genre", formData.genre);
      data.append("isbn", validation.formatted.replace(/-/g, ''));
      data.append("numPages", String(formData.numPages));
      data.append("numChapters", String(formData.numChapters));
      data.append("numTotalLivres", String(formData.numTotalLivres));
      data.append("synopsis", formData.synopsis);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await LivreAPI.update(Number(id), data);
      navigate("/biblio/livres");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        setError("Un livre avec cet ISBN existe déjà");
      } else {
        setError("Erreur lors de la modification du livre");
      }
    } finally {
      setSaving(false);
    }
  };

  const validISBNExamples = [
    { type: "ISBN-13", example: "978-2-07-036822-8" },
    { type: "ISBN-13", example: "978-2-253-00183-4" },
    { type: "ISBN-13", example: "978-2-07-042352-0" },
    { type: "ISBN-13", example: "978-2-07-037917-7" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-beige p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-chocolate-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-chocolate-700 font-medium">Chargement du livre...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-chocolate-700 hover:text-chocolate-900 mb-6 group transition-colors"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour au catalogue</span>
        </button>

        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-2xl overflow-hidden border border-chocolate-100">
          <div className="bg-gradient-to-r from-brown-900 to-chocolate-800 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <BookOpen size={32} className="text-amber-100" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-amber-50">
                  Modifier le livre
                </h1>
                <p className="text-amber-100/80 mt-1">
                  Modifiez les informations de cet ouvrage
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg">
                <p className="text-rose-800 font-medium flex items-center gap-2">
                  <span className="text-rose-600">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-brown-900 font-semibold mb-2">
                      Titre du livre *
                    </label>
                    <input
                      name="titre"
                      placeholder="Ex: Le Petit Prince"
                      required
                      value={formData.titre}
                      onChange={handleChange}
                      className="w-full p-4 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 placeholder-chocolate-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-brown-900 font-semibold mb-2">
                      Auteur
                    </label>
                    <input
                      name="auteur"
                      placeholder="Ex: Antoine de Saint-Exupéry"
                      value={formData.auteur}
                      onChange={handleChange}
                      className="w-full p-4 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 placeholder-chocolate-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-brown-900 font-semibold mb-2">
                      Genre
                    </label>
                    <input
                      name="genre"
                      placeholder="Ex: Roman, Science-fiction, Poésie..."
                      value={formData.genre}
                      onChange={handleChange}
                      className="w-full p-4 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 placeholder-chocolate-400 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-brown-900 font-semibold">
                        ISBN (13 chiffres) *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const examples = validISBNExamples;
                          const randomExample = examples[Math.floor(Math.random() * examples.length)];
                          setFormData(prev => ({ ...prev, isbn: randomExample.example }));
                          const validation = validateISBN(randomExample.example);
                          setIsbnValid(validation.isValid);
                          setIsbnError("");
                        }}
                        className="text-xs text-chocolate-600 hover:text-chocolate-800 flex items-center gap-1"
                      >
                        <Info size={12} />
                        Exemple
                      </button>
                    </div>
                    
                    <div className="relative">
                      <input
                        name="isbn"
                        placeholder="Ex: 978-2-07-036822-8"
                        required
                        value={formData.isbn}
                        onChange={handleChange}
                        maxLength={17}
                        className={`w-full p-4 pr-12 bg-white border-2 rounded-xl focus:ring-2 focus:outline-none text-brown-900 placeholder-chocolate-400 font-mono transition-all ${
                          isbnError && !isbnValid
                            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200"
                            : isbnValid
                            ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-200"
                            : "border-chocolate-200 focus:border-chocolate-500 focus:ring-chocolate-200"
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isbnValid ? (
                          <CheckCircle size={20} className="text-emerald-500" />
                        ) : isbnError ? (
                          <XCircle size={20} className="text-rose-500" />
                        ) : null}
                      </div>
                    </div>
                    
                    {isbnError && (
                      <p className="mt-2 text-rose-600 text-sm flex items-center gap-1">
                        <XCircle size={14} />
                        {isbnError}
                      </p>
                    )}
                    
                    {isbnValid && (
                      <p className="mt-2 text-emerald-600 text-sm flex items-center gap-1">
                        <CheckCircle size={14} />
                        Format ISBN-13 valide ✓
                      </p>
                    )}

                    <div className="mt-2">
                      <p className="text-chocolate-600 text-sm">
                        Chiffres saisis : {formData.isbn.replace(/\D/g, '').length}/13
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-brown-900 font-semibold mb-2">
                        Pages
                      </label>
                      <input
                        type="number"
                        name="numPages"
                        placeholder="0"
                        min="0"
                        value={formData.numPages || ""}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 text-center transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-brown-900 font-semibold mb-2">
                        Chapitres
                      </label>
                      <input
                        type="number"
                        name="numChapters"
                        placeholder="0"
                        min="0"
                        value={formData.numChapters || ""}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 text-center transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-brown-900 font-semibold mb-2">
                        Exemplaires
                      </label>
                      <input
                        type="number"
                        name="numTotalLivres"
                        placeholder="0"
                        min="0"
                        value={formData.numTotalLivres || ""}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 text-center transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-brown-900 font-semibold mb-2">
                      Couverture
                    </label>
                    <div className="space-y-4">
                      {book?.image && !formData.image && (
                        <div>
                          <p className="text-chocolate-600 text-sm mb-2">Image actuelle :</p>
                          <div className="relative w-40 h-56 mx-auto">
                            <img
                              src={book.image}
                              alt={book.titre}
                              className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-chocolate-300 rounded-xl bg-chocolate-50 hover:bg-chocolate-100 cursor-pointer transition-colors group"
                        >
                          <Upload size={32} className="text-chocolate-500 mb-2 group-hover:text-chocolate-700" />
                          <span className="text-chocolate-700 font-medium">
                            Cliquez pour changer l'image
                          </span>
                          <span className="text-chocolate-500 text-sm mt-1">
                            PNG, JPG, JPEG (max 5MB)
                          </span>
                        </label>
                      </div>

                      {(imagePreview || (formData.image && !imagePreview)) && (
                        <div>
                          <p className="text-brown-900 font-medium mb-2">Nouvelle image :</p>
                          <div className="relative w-40 h-56 mx-auto">
                            <img
                              src={imagePreview || (formData.image ? URL.createObjectURL(formData.image) : "")}
                              alt="Prévisualisation"
                              className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-brown-900 font-semibold mb-2">
                  Synopsis
                </label>
                <textarea
                  name="synopsis"
                  placeholder="Décrivez brièvement l'histoire du livre..."
                  rows={4}
                  maxLength={500}
                  value={formData.synopsis}
                  onChange={handleChange}
                  className="w-full p-4 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 placeholder-chocolate-400 transition-all resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-chocolate-500 text-sm">
                    {formData.synopsis.length}/500 caractères
                  </p>
                  {formData.synopsis.length >= 450 && (
                    <p className="text-amber-600 text-sm">
                      {500 - formData.synopsis.length} caractères restants
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-chocolate-100">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 px-6 border-2 border-chocolate-300 text-chocolate-700 font-semibold rounded-xl hover:bg-chocolate-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !isbnValid || !formData.titre}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-brown-700 to-chocolate-700 text-amber-100 font-semibold rounded-xl hover:from-brown-800 hover:to-chocolate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-amber-100 border-t-transparent rounded-full"></div>
                      <span>Modification en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Enregistrer les modifications</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm flex items-start gap-2">
                <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Format ISBN simplifié :</strong> Seul le format ISBN-13 (13 chiffres) est accepté.
                  Les tirets sont ajoutés automatiquement pendant la saisie. 
                  Le bouton "Exemple" génère un ISBN-13 pour vous aider.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;