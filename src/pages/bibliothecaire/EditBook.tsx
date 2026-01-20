import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { LivreAPI } from "../../api/livre.api";
import { Book } from "../../types/Book";
import { BookOpen, Upload, Save, CheckCircle, XCircle, Info, ArrowLeft } from "lucide-react";

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
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const validateISBN = (isbn: string): { isValid: boolean; formatted: string; error: string } => {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const regex = /^[0-9]{13}$/;
    
    if (!cleanISBN) {
      return {
        isValid: false,
        formatted: isbn,
        error: "L'ISBN est requis"
      };
    }
    
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
        if (!id) {
          setError("ID du livre non spécifié");
          setLoading(false);
          return;
        }

        const data: Book = await LivreAPI.getById(Number(id));
        console.log("Book data loaded:", data);
        setBook(data);

        // Store current image URL for display
        if (data.image) {
          setCurrentImage(data.image);
        }

        setFormData({
          titre: data.titre || "",
          auteur: data.auteur || "",
          genre: data.genre || "",
          isbn: data.isbn || "",
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
      } catch (err: any) {
        console.error("Erreur lors du chargement du livre:", err);
        if (err.response?.status === 404) {
          setError("Livre non trouvé");
        } else {
          setError(err.message || "Erreur lors du chargement du livre");
        }
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
    } else if (name === "titre" || name === "auteur" || name === "genre") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "synopsis") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      // Handle numeric fields
      setFormData(prev => ({
        ...prev,
        [name]: Number(value) || 0,
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

    // Validate required fields
    if (!formData.titre.trim()) {
      setError("Le titre du livre est requis");
      setSaving(false);
      return;
    }

    const validation = validateISBN(formData.isbn);
    if (!validation.isValid) {
      setIsbnError(validation.error || "ISBN invalide");
      setIsbnValid(false);
      setSaving(false);
      return;
    }

    try {
      const data = new FormData();

      // Append all form data
      data.append("titre", formData.titre.trim());
      data.append("auteur", formData.auteur.trim());
      data.append("genre", formData.genre.trim());
      data.append("isbn", validation.formatted.replace(/-/g, ''));
      data.append("numPages", String(formData.numPages || 0));
      data.append("numChapters", String(formData.numChapters || 0));
      data.append("numTotalLivres", String(formData.numTotalLivres || 0));
      data.append("synopsis", formData.synopsis.trim());

      if (formData.image) {
        data.append("image", formData.image);
      }

      console.log("Updating book with data:", {
        titre: formData.titre,
        isbn: formData.isbn,
        hasImage: !!formData.image,
      });

      if (id) {
        await LivreAPI.update(Number(id), data);
        navigate("/biblio/livres");
      } else {
        setError("ID du livre manquant");
      }
    } catch (err: any) {
      console.error("Erreur lors de la modification:", err);
      if (err.response?.status === 409) {
        setError("Un livre avec cet ISBN existe déjà");
      } else if (err.response?.status === 404) {
        setError("Livre non trouvé. Impossible de mettre à jour.");
      } else if (err.response?.status === 400) {
        setError("Données invalides. Vérifiez les informations saisies.");
      } else {
        setError(err.message || "Erreur lors de la modification du livre");
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
      fontSize: '1rem',
      color: '#FFFBF5',
      textDecoration: 'none' as const,
      padding: '10px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      borderRadius: '10px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: 800,
      letterSpacing: '2px',
      color: '#FFFBF5',
      fontFamily: "'Playfair Display', serif",
    },
    card: {
      backgroundColor: 'rgba(255, 251, 245, 0.08)',
      backdropFilter: 'blur(15px)',
      borderRadius: '18px',
      padding: '30px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
    },
    label: {
      fontSize: '1rem',
      color: 'rgba(255, 251, 245, 0.9)',
      marginBottom: '10px',
      fontWeight: 600,
      display: 'block' as const,
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '12px',
      color: '#FFFBF5',
      fontSize: '1.1rem',
      fontFamily: "'Cormorant Garamond', serif",
      outline: 'none' as const,
      transition: 'all 0.3s ease',
    },
    textarea: {
      width: '100%',
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '12px',
      color: '#FFFBF5',
      fontSize: '1.1rem',
      fontFamily: "'Cormorant Garamond', serif",
      outline: 'none' as const,
      transition: 'all 0.3s ease',
      resize: 'none' as const,
      minHeight: '120px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '20px',
      marginTop: '30px',
      paddingTop: '30px',
      borderTop: '2px solid rgba(255, 251, 245, 0.1)',
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
      borderRadius: '12px',
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
      borderRadius: '12px',
      color: '#FFD166',
      marginTop: '25px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    },
    fileUpload: {
      border: '2px dashed rgba(255, 251, 245, 0.3)',
      borderRadius: '12px',
      padding: '40px 20px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255, 251, 245, 0.05)',
    },
    currentImageContainer: {
      marginBottom: '20px',
      textAlign: 'center' as const,
    },
    currentImage: {
      width: '150px',
      height: '200px',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      margin: '10px auto 0',
    },
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#281C16',
      color: '#FFFBF5',
    },
    loadingText: {
      fontSize: '1.5rem',
      fontFamily: "'Cormorant Garamond', serif",
      animation: 'pulse 2s infinite',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '25px',
      marginBottom: '25px',
    },
    numberGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
      marginBottom: '20px',
    },
    numberInputContainer: {
      textAlign: 'center' as const,
    },
    numberInput: {
      textAlign: 'center' as const,
      width: '100%',
    },
    imagePreviewContainer: {
      marginTop: '15px',
      textAlign: 'center' as const,
    },
    imagePreview: {
      width: '150px',
      height: '200px',
      margin: '10px auto 0',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 251, 245, 0.3)',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>
          Chargement du livre...
        </div>
      </div>
    );
  }

  if (error && !book && !loading) {
    return (
      <div style={styles.container}>
        <div style={styles.background}>
          <div style={styles.gradientOverlay} />
        </div>
        <div style={styles.content}>
          <header style={styles.header}>
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
              <ArrowLeft size={20} />
              Retour
            </Link>
            <div style={styles.title}>
              Livre Non Trouvé
            </div>
          </header>
          <div style={styles.card}>
            <div style={styles.errorAlert}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Link
                to="/biblio/livres"
                style={{
                  ...styles.submitButton,
                  display: 'inline-flex',
                  width: 'auto',
                  padding: '15px 30px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFD166';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 209, 102, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD166';
                  e.currentTarget.style.color = '#3C2F2F';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Retour à la liste des livres
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <ArrowLeft size={20} />
              Retour
            </Link>
            <div style={styles.title}>
              Modifier le Livre
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
            <div style={styles.formGrid}>
              {/* Left Column */}
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    Titre du livre *
                  </label>
                  <input
                    name="titre"
                    placeholder="Ex: Le Petit Prince"
                    required
                    value={formData.titre}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FFD166';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    Auteur
                  </label>
                  <input
                    name="auteur"
                    placeholder="Ex: Antoine de Saint-Exupéry"
                    value={formData.auteur}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FFD166';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    Genre
                  </label>
                  <input
                    name="genre"
                    placeholder="Ex: Roman, Science-fiction, Poésie..."
                    value={formData.genre}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FFD166';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={styles.label}>
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
                      style={{
                        fontSize: '0.8rem',
                        color: '#FFD166',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFFBF5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#FFD166';
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
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FFD166';
                        e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                      }}
                      onBlur={(e) => {
                        if (!isbnError && !isbnValid) {
                          e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                        }
                        e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
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
                  <label style={styles.label}>
                    Métadonnées
                  </label>
                  <div style={styles.numberGrid}>
                    <div style={styles.numberInputContainer}>
                      <label style={{ ...styles.label, textAlign: 'center', marginBottom: '5px' }}>
                        Pages
                      </label>
                      <input
                        type="number"
                        name="numPages"
                        placeholder="0"
                        min="0"
                        value={formData.numPages || ""}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.numberInput }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#FFD166';
                          e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                          e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                        }}
                      />
                    </div>
                    <div style={styles.numberInputContainer}>
                      <label style={{ ...styles.label, textAlign: 'center', marginBottom: '5px' }}>
                        Chapitres
                      </label>
                      <input
                        type="number"
                        name="numChapters"
                        placeholder="0"
                        min="0"
                        value={formData.numChapters || ""}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.numberInput }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#FFD166';
                          e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                          e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                        }}
                      />
                    </div>
                    <div style={styles.numberInputContainer}>
                      <label style={{ ...styles.label, textAlign: 'center', marginBottom: '5px' }}>
                        Exemplaires
                      </label>
                      <input
                        type="number"
                        name="numTotalLivres"
                        placeholder="0"
                        min="0"
                        value={formData.numTotalLivres || ""}
                        onChange={handleChange}
                        style={{ ...styles.input, ...styles.numberInput }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#FFD166';
                          e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                          e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    Couverture
                  </label>
                  
                  {currentImage && !formData.image && (
                    <div style={styles.currentImageContainer}>
                      <p style={{ ...styles.label, textAlign: 'left', marginBottom: '5px' }}>
                        Image actuelle :
                      </p>
                      <div style={styles.currentImage}>
                        <img
                          src={currentImage}
                          alt={formData.titre}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}

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
                      Cliquez pour changer l'image
                    </div>
                    <div style={{ color: 'rgba(255, 251, 245, 0.7)', fontSize: '0.9rem' }}>
                      PNG, JPG, JPEG (max 5MB)
                    </div>
                  </label>
                  
                  {imagePreview && (
                    <div style={styles.imagePreviewContainer}>
                      <p style={{ ...styles.label, textAlign: 'left' }}>
                        Nouvelle image :
                      </p>
                      <div style={styles.imagePreview}>
                        <img
                          src={imagePreview}
                          alt="Nouvelle image"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>
                Synopsis
              </label>
              <textarea
                name="synopsis"
                placeholder="Décrivez brièvement l'histoire du livre..."
                rows={4}
                maxLength={500}
                value={formData.synopsis}
                onChange={handleChange}
                style={styles.textarea}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD166';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                }}
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
                onClick={() => navigate("/biblio/livres")}
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
                disabled={saving || !isbnValid || !formData.titre.trim()}
                style={{
                  ...styles.submitButton,
                  opacity: saving || !isbnValid || !formData.titre.trim() ? 0.6 : 1,
                  cursor: saving || !isbnValid || !formData.titre.trim() ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!saving && isbnValid && formData.titre.trim()) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFD166';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 209, 102, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving && isbnValid && formData.titre.trim()) {
                    e.currentTarget.style.backgroundColor = '#FFD166';
                    e.currentTarget.style.color = '#3C2F2F';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {saving ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #3C2F2F',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Enregistrer les modifications
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
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 251, 245, 0.1);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #FFD166, #FF9B54);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #FF9B54, #FF6B6B);
          }
          
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </div>
  );
};

export default EditBook;