import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LivreAPI } from '../../api/livre.api';
import { Book } from '../../types/Book';
import {
  PlusCircle,
  Edit,
  Trash2,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';

const AllBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await LivreAPI.delete(confirmDeleteId);
      setBooks(prev => prev.filter(b => b.idLivre !== confirmDeleteId));
      showNotification('success', 'Livre supprimé avec succès');
    } catch {
      showNotification('error', 'Erreur lors de la suppression du livre');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await LivreAPI.getAll();
        setBooks(data);
      } catch {
        setError('Erreur lors du chargement des livres');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    const v = search.toLowerCase();
    return (
      book.titre.toLowerCase().includes(v) ||
      book.isbn.toLowerCase().includes(v) ||
      (book.auteur && book.auteur.toLowerCase().includes(v)) ||
      (book.genre && book.genre.toLowerCase().includes(v))
    );
  });

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
    addButton: {
      padding: '15px 30px',
      backgroundColor: '#FFD166',
      color: '#3C2F2F',
      border: '2px solid #FFD166',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 600,
      textDecoration: 'none' as const,
      fontFamily: "'Cormorant Garamond', serif",
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    searchCard: {
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '25px',
      marginBottom: '40px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
    },
    searchLabel: {
      fontSize: '0.9rem',
      color: 'rgba(255, 251, 245, 0.7)',
      marginBottom: '8px',
      fontWeight: 600,
    },
    searchInput: {
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
    tableCard: {
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '25px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      overflow: 'auto' as const,
    },
    table: {
      width: '100%',
      borderCollapse: 'separate' as const,
      borderSpacing: '0',
    },
    th: {
      padding: '20px',
      textAlign: 'left' as const,
      color: 'rgba(255, 251, 245, 0.9)',
      fontWeight: 600,
      fontSize: '1.1rem',
      borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
    },
    td: {
      padding: '20px',
      borderBottom: '1px solid rgba(255, 251, 245, 0.1)',
      verticalAlign: 'middle' as const,
    },
    actionButton: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 209, 102, 0.1)',
      color: '#FFD166',
      border: '2px solid rgba(255, 209, 102, 0.3)',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 600,
      textDecoration: 'none' as const,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
    },
    deleteButton: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      color: '#FF6B6B',
      border: '2px solid rgba(255, 107, 107, 0.3)',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: 'rgba(255, 251, 245, 0.7)',
      fontSize: '1.2rem',
      fontStyle: 'italic',
    },
    badge: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 209, 102, 0.2)',
      color: '#FFD166',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 600,
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
    notification: {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      zIndex: 50,
      animation: 'slideIn 0.3s ease-out forwards',
    },
    modalOverlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 100,
    },
    modalContent: {
      backgroundColor: 'rgba(40, 28, 22, 0.95)',
      borderRadius: '16px',
      padding: '30px',
      maxWidth: '500px',
      width: '100%',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      backdropFilter: 'blur(15px)',
      animation: 'scaleIn 0.2s ease-out',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>
          Chargement des livres...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.background}>
          <div style={styles.gradientOverlay} />
        </div>
        <div style={styles.content}>
          <div style={{
            ...styles.tableCard,
            textAlign: 'center',
            padding: '60px',
          }}>
            <AlertCircle size={48} style={{ color: '#FF6B6B', margin: '0 auto 20px' }} />
            <div style={{ color: '#FFFBF5', fontSize: '1.2rem', marginBottom: '20px' }}>
              {error}
            </div>
            <Link to="/biblio" style={styles.backButton}>
              ← Retour au Dashboard
            </Link>
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

      {/* Notification */}
      {notification.show && (
        <div style={styles.notification}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            backgroundColor: notification.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 107, 107, 0.2)',
            border: `2px solid ${notification.type === 'success' ? '#4CAF50' : '#FF6B6B'}`,
            borderRadius: '10px',
            color: '#FFFBF5',
            backdropFilter: 'blur(10px)',
          }}>
            {notification.type === 'success' ? (
              <CheckCircle size={24} color="#4CAF50" />
            ) : (
              <XCircle size={24} color="#FF6B6B" />
            )}
            <span style={{ fontWeight: 600 }}>{notification.message}</span>
            <button
              onClick={() => setNotification(n => ({ ...n, show: false }))}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 251, 245, 0.7)',
                cursor: 'pointer',
                marginLeft: '20px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  padding: '10px',
                  backgroundColor: 'rgba(255, 107, 107, 0.2)',
                  borderRadius: '10px',
                }}>
                  <AlertCircle size={28} color="#FF6B6B" />
                </div>
                <div style={{ ...styles.title, fontSize: '1.8rem' }}>
                  Confirmer la suppression
                </div>
              </div>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 251, 245, 0.7)',
                  cursor: 'pointer',
                  padding: '5px',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <p style={{ color: 'rgba(255, 251, 245, 0.9)', fontSize: '1.1rem', marginBottom: '15px' }}>
                Êtes-vous sûr de vouloir supprimer ce livre ?
              </p>
              <div style={{
                padding: '15px',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderLeft: '4px solid #FF6B6B',
                borderRadius: '0 8px 8px 0',
              }}>
                <p style={{ color: '#FF6B6B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} />
                  Cette action est irréversible
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  ...styles.actionButton,
                  backgroundColor: 'rgba(255, 251, 245, 0.1)',
                  borderColor: 'rgba(255, 251, 245, 0.3)',
                  color: '#FFFBF5',
                  padding: '12px 24px',
                }}
              >
                <X size={18} />
                Annuler
              </button>
              <button
                onClick={handleDelete}
                style={{
                  ...styles.deleteButton,
                  padding: '12px 24px',
                }}
              >
                <Trash2 size={18} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              to="/biblio"
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
              Gestion des Livres
            </div>
          </div>
          
          <Link
            to="/biblio/livres/ajouter"
            style={styles.addButton}
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
            <PlusCircle size={20} />
            Nouveau Livre
          </Link>
        </header>

        {/* Search */}
        <div style={styles.searchCard}>
          <div style={styles.searchLabel}>Rechercher des livres</div>
          <input
            type="text"
            placeholder="Rechercher par titre, auteur, genre ou ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#FFD166';
              e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
              e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
            }}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '25px',
            paddingTop: '25px',
            borderTop: '1px solid rgba(255, 251, 245, 0.1)',
          }}>
            <div style={{
              color: 'rgba(255, 251, 245, 0.9)',
              fontSize: '1.1rem',
            }}>
              Affichage de {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Couverture</th>
                <th style={styles.th}>Titre</th>
                <th style={styles.th}>Auteur</th>
                <th style={styles.th}>Genre</th>
                <th style={styles.th}>ISBN</th>
                <th style={styles.th}>Pages</th>
                <th style={styles.th}>Chapitres</th>
                <th style={styles.th}>Exemplaires</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={10} style={styles.emptyState}>
                    <BookOpen size={48} style={{ color: 'rgba(255, 251, 245, 0.5)', marginBottom: '20px' }} />
                    <div style={{ color: 'rgba(255, 251, 245, 0.7)', fontSize: '1.2rem' }}>
                      Aucun livre trouvé
                    </div>
                    <div style={{ color: 'rgba(255, 251, 245, 0.5)', marginTop: '10px' }}>
                      Essayez d'autres termes de recherche
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr
                    key={book.idLivre}
                    style={{
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={styles.td}>
                      <span style={styles.badge}>
                        #{book.idLivre}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{
                        width: '60px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid rgba(255, 251, 245, 0.2)',
                      }}>
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.titre}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 251, 245, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <BookOpen size={24} style={{ color: 'rgba(255, 251, 245, 0.3)' }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: '#FFFBF5', fontWeight: 600, fontSize: '1.1rem' }}>
                        {book.titre}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: 'rgba(255, 251, 245, 0.9)' }}>
                        {book.auteur || <span style={{ color: 'rgba(255, 251, 245, 0.5)', fontStyle: 'italic' }}>Non renseigné</span>}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {book.genre && (
                        <span style={styles.badge}>
                          {book.genre}
                        </span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <code style={{
                        backgroundColor: 'rgba(255, 251, 245, 0.1)',
                        color: '#FFD166',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                      }}>
                        {book.isbn}
                      </code>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: 'rgba(255, 251, 245, 0.9)' }}>
                        {book.numPages || '-'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: 'rgba(255, 251, 245, 0.9)' }}>
                        {book.numChapters || '-'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'rgba(255, 251, 245, 0.1)',
                        borderRadius: '50%',
                        color: '#FFFBF5',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                      }}>
                        {book.numTotalLivres}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                          to={`/biblio/livres/${book.idLivre}/modifier`}
                          style={styles.actionButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                            e.currentTarget.style.borderColor = '#FFD166';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                          }}
                        >
                          <Edit size={16} />
                          Modifier
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(book.idLivre)}
                          style={styles.deleteButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                            e.currentTarget.style.borderColor = '#FF6B6B';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                          }}
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
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

export default AllBooks;