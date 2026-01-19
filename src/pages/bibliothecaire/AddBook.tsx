import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LivreAPI } from "../../api/livre.api";
import { BookOpen, Upload, PlusCircle, CheckCircle, XCircle, Info } from "lucide-react";

const AddBook = () => {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError("");

    const validation = validateISBN(formData.isbn);
    if (!validation.isValid) {
      setIsbnError(validation.error || "ISBN invalide");
      setIsbnValid(false);
      setLoading(false);
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

      await LivreAPI.create(data);
      navigate("/biblio/livres");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        setError("Un livre avec cet ISBN existe déjà");
      } else {
        setError("Erreur lors de l'ajout du livre");
      }
    } finally {
      setLoading(false);
    }
  };

  const validISBNExamples = [
    { type: "ISBN-13", example: "978-2-07-036822-8" },
    { type: "ISBN-13", example: "978-2-253-00183-4" },
    { type: "ISBN-13", example: "978-2-07-042352-0" },
    { type: "ISBN-13", example: "978-2-07-037917-7" }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      position: 'relative' as const,
      fontFamily: "'Cormorant Garamond', serif",
      color: '#FFFBF5',
      overflow: 'hidden' as const,
      backgroundColor: '#281C16',
      padding: '70px 50px',
    },
    background: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url(https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1920&q=90&ar=16:9)',
      backgroundSize: 'cover' as const,
      backgroundPosition: 'center' as const,
      filter: 'brightness(0.8)',
      zIndex: 0,
    },
    gradientOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(40, 28, 22, 0.95) 0%, rgba(156, 81, 73, 0.9) 100%)',
      zIndex: 1,
    },
    content: {
      position: 'relative' as const,
      zIndex: 2,
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
    },
    backButton: {
      fontSize: '1.5rem',
      color: '#FFFBF5',
      textDecoration: 'none' as const,
      padding: '10px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      borderRadius: '10px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: 800,
      letterSpacing: '2px',
      color: '#FFFBF5',
      fontFamily: "'Playfair Display', serif",
    },
    card: {
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '30px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
    },
    label: {
      fontSize: '0.9rem',
      color: 'rgba(255, 251, 245, 0.7)',
      marginBottom: '8px',
      fontWeight: 600,
      display: 'block' as const,
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '10px',
      color: '#FFFBF5',
      fontSize: '1rem',
      fontFamily: "'Cormorant Garamond', serif",
      outline: 'none' as const,
      transition: 'all 0.3s ease',
    },
    textarea: {
      width: '100%',
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '10px',
      color: '#FFFBF5',
      fontSize: '1rem',
      fontFamily: "'Cormorant Garamond', serif",
      outline: 'none' as const,
      transition: 'all 0.3s ease',
      resize: 'none' as const,
      minHeight: '120px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
      paddingTop: '30px',
      borderTop: '1px solid rgba(255, 251, 245, 0.1)',
    },
    cancelButton: {
      flex: 1,
      padding: '15px 30px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      color: '#FFFBF5',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    submitButton: {
      flex: 1,
      padding: '15px 30px',
      backgroundColor: '#FFD166',
      color: '#3C2F2F',
      border: '2px solid #FFD166',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    errorAlert: {
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      border: '2px solid rgba(255, 107, 107, 0.3)',
      borderRadius: '10px',
      color: '#FF6B6B',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    infoBox: {
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 209, 102, 0.1)',
      border: '2px solid rgba(255, 209, 102, 0.3)',
      borderRadius: '10px',
      color: '#FFD166',
      marginTop: '25px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    },
    fileUpload: {
      border: '2px dashed rgba(255, 251, 245, 0.3)',
      borderRadius: '10px',
      padding: '40px 20px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255, 251, 245, 0.05)',
    },
    numberInput: {
      textAlign: 'center' as const,
    }
  };

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background}>
        <div style={styles.gradientOverlay} />
      </div>

      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              to="/biblio/livres"
              style={styles.backButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                e.currentTarget.style.transform = 'translateX(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              ← Retour
            </Link>
            <div style={styles.title}>
              Ajouter un Nouveau Livre
            </div>
          </div>
        </header>

        {/* Main Form */}
        <div style={styles.card}>
          {error && (
            <div style={styles.errorAlert}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              {/* Left Column */}
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Titre du livre *</label>
                  <input
                    name="titre"
                    placeholder="Ex: Le Petit Prince"
                    required
                    value={formData.titre}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Auteur</label>
                  <input
                    name="auteur"
                    placeholder="Ex: Antoine de Saint-Exupéry"
                    value={formData.auteur}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Genre</label>
                  <input
                    name="genre"
                    placeholder="Ex: Roman, Science-fiction, Poésie..."
                    value={formData.genre}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={styles.label}>ISBN (13 chiffres) *</label>
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
                      style={{
                        fontSize: '0.8rem',
                        color: '#FFD166',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Info size={12} />
                      Exemple
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="isbn"
                      placeholder="Ex: 978-2-07-036822-8"
                      required
                      value={formData.isbn}
                      onChange={handleChange}
                      maxLength={17}
                      style={{
                        ...styles.input,
                        paddingRight: '50px',
                        borderColor: isbnError && !isbnValid ? '#FF6B6B' : 
                                   isbnValid ? '#4CAF50' : 'rgba(255, 251, 245, 0.3)',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}>
                      {isbnValid ? (
                        <CheckCircle size={20} color="#4CAF50" />
                      ) : isbnError ? (
                        <XCircle size={20} color="#FF6B6B" />
                      ) : null}
                    </div>
                  </div>
                  {isbnError && (
                    <p style={{ color: '#FF6B6B', fontSize: '0.9rem', marginTop: '5px', marginBottom: 0 }}>
                      {isbnError}
                    </p>
                  )}
                  <p style={{ color: 'rgba(255, 251, 245, 0.7)', fontSize: '0.8rem', marginTop: '5px', marginBottom: 0 }}>
                    Chiffres saisis : {formData.isbn.replace(/\D/g, '').length}/13
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Métadonnées</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ ...styles.label, textAlign: 'center' }}>Pages</label>
                      <input
                        type="number"
                        name="numPages"
                        placeholder="0"
                        min="0"
                        value={formData.numPages || ""}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.numberInput }}
                      />
                    </div>
                    <div>
                      <label style={{ ...styles.label, textAlign: 'center' }}>Chapitres</label>
                      <input
                        type="number"
                        name="numChapters"
                        placeholder="0"
                        min="0"
                        value={formData.numChapters || ""}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.numberInput }}
                      />
                    </div>
                    <div>
                      <label style={{ ...styles.label, textAlign: 'center' }}>Exemplaires</label>
                      <input
                        type="number"
                        name="numTotalLivres"
                        placeholder="0"
                        min="0"
                        value={formData.numTotalLivres || ""}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.numberInput }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Couverture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="image-upload"
                    style={styles.fileUpload}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FFD166';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.05)';
                    }}
                  >
                    <Upload size={32} style={{ color: 'rgba(255, 251, 245, 0.7)', marginBottom: '10px' }} />
                    <div style={{ color: '#FFFBF5', fontWeight: 600, marginBottom: '5px' }}>
                      Cliquez pour télécharger une image
                    </div>
                    <div style={{ color: 'rgba(255, 251, 245, 0.7)', fontSize: '0.9rem' }}>
                      PNG, JPG, JPEG (max 5MB)
                    </div>
                  </label>
                  
                  {imagePreview && (
                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                      <p style={{ ...styles.label, textAlign: 'left' }}>Aperçu :</p>
                      <div style={{
                        width: '120px',
                        height: '160px',
                        margin: '0 auto',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid rgba(255, 251, 245, 0.2)',
                      }}>
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Synopsis</label>
              <textarea
                name="synopsis"
                placeholder="Décrivez brièvement l'histoire du livre..."
                rows={4}
                maxLength={500}
                value={formData.synopsis}
                onChange={handleChange}
                style={styles.textarea}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <p style={{ color: 'rgba(255, 251, 245, 0.7)', fontSize: '0.8rem' }}>
                  {formData.synopsis.length}/500 caractères
                </p>
                {formData.synopsis.length >= 450 && (
                  <p style={{ color: '#FFD166', fontSize: '0.8rem' }}>
                    {500 - formData.synopsis.length} caractères restants
                  </p>
                )}
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={styles.cancelButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                  e.currentTarget.style.borderColor = '#FFFBF5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !isbnValid || !formData.titre}
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  if (!loading && isbnValid && formData.titre) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFD166';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 209, 102, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && isbnValid && formData.titre) {
                    e.currentTarget.style.backgroundColor = '#FFD166';
                    e.currentTarget.style.color = '#3C2F2F';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #3C2F2F',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <PlusCircle size={20} />
                    Ajouter le livre
                  </>
                )}
              </button>
            </div>
          </form>

          <div style={styles.infoBox}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Format ISBN simplifié :</strong> Seul le format ISBN-13 (13 chiffres) est accepté.
              Les tirets sont ajoutés automatiquement pendant la saisie. 
              Le bouton "Exemple" génère un ISBN-13 pour vous aider.
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default AddBook;