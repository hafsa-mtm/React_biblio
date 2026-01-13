import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LivreAPI } from '../../api/livre.api';
import { Book } from '../../types/Book';
import {
  Search,
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

  const navigate = useNavigate();

  /* ================= NOTIFICATION ================= */
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  /* ================= DELETE ================= */
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

  /* ================= FETCH ================= */
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

  /* ================= SEARCH ================= */
  const filteredBooks = books.filter(book => {
    const v = search.toLowerCase();
    return (
      book.titre.toLowerCase().includes(v) ||
      book.isbn.toLowerCase().includes(v) ||
      (book.auteur && book.auteur.toLowerCase().includes(v)) ||
      (book.genre && book.genre.toLowerCase().includes(v))
    );
  });

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-chocolate-600 mx-auto"></div>
          <p className="mt-4 text-chocolate-800 text-lg">Chargement des ouvrages...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md border border-chocolate-200">
          <div className="text-red-500 text-center mb-4">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <p className="text-center text-chocolate-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige p-6 relative">

      {/* ================= NOTIFICATION ================= */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl min-w-[320px] border-l-4 ${
              notification.type === 'success'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-700'
                : 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-700'
            }`}
          >
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle size={24} className="text-emerald-100" />
              ) : (
                <XCircle size={24} className="text-rose-100" />
              )}
            </div>
            <span className="flex-1 font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(n => ({ ...n, show: false }))}
              className="ml-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ================= CONFIRM MODAL - STYLE CHOCOLAT/AMBRE ================= */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn border border-chocolate-100"
            style={{
              animation: 'scaleIn 0.2s ease-out forwards'
            }}
          >
            {/* En-tête modal */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg">
                  <AlertCircle className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-brown-900">
                  Confirmer la suppression
                </h2>
              </div>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="p-2 hover:bg-chocolate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-brown-700" />
              </button>
            </div>

            {/* Message */}
            <div className="mb-8">
              <p className="text-brown-700 text-lg mb-3">
                Êtes-vous sûr de vouloir supprimer ce livre ?
              </p>
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                <p className="text-rose-800 font-medium flex items-center gap-2">
                  <AlertCircle size={18} />
                  Cette action est irréversible
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="group px-6 py-3 rounded-xl border-2 border-chocolate-300 text-chocolate-700 font-medium hover:bg-chocolate-50 transition-all duration-200 flex items-center gap-2"
              >
                <X size={18} />
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="group px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-medium shadow-lg hover:shadow-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-200 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-chocolate-700 rounded-xl">
                <BookOpen size={28} className="text-amber-100" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-brown-900">
                  Catalogue des Livres
                </h1>
                <p className="text-brown-600 mt-1">
                  {books.length} ouvrage{books.length > 1 ? 's' : ''} enregistré{books.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/biblio/livres/ajouter')}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brown-700 to-chocolate-700 text-amber-100 font-semibold rounded-xl hover:from-brown-900 hover:to-chocolate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <PlusCircle size={20} />
              Nouvel ouvrage
            </button>
          </div>

          {/* ================= SEARCH ================= */}
          <div className="relative mt-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-chocolate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, genre ou ISBN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-chocolate-200 rounded-xl focus:border-chocolate-500 focus:ring-2 focus:ring-chocolate-200 focus:outline-none text-brown-900 placeholder-chocolate-400 shadow-sm"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-chocolate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-brown-900 to-chocolate-800">
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Couverture
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Chapitres
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Exemplaires
                  </th>
                  <th className="py-4 px-6 text-left text-amber-50 font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-chocolate-100">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpen size={48} className="text-chocolate-300 mb-4" />
                        <p className="text-brown-600 text-lg font-medium">
                          Aucun ouvrage trouvé
                        </p>
                        <p className="text-brown-500 mt-2">
                          Essayez d'autres termes de recherche
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map(book => (
                    <tr
                      key={book.idLivre}
                      className="hover:bg-amber-50 transition-colors duration-200 group"
                    >
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-chocolate-100 text-brown-700 font-semibold rounded-lg">
                          #{book.idLivre}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="relative">
                          {book.image ? (
                            <img
                              src={book.image}
                              alt={book.titre}
                              className="w-20 h-28 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                            />
                          ) : (
                            <div className="w-20 h-28 bg-gradient-to-br from-chocolate-100 to-chocolate-200 rounded-lg flex items-center justify-center">
                              <BookOpen size={24} className="text-brown-500" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-semibold text-brown-900 group-hover:text-chocolate-700 transition-colors">
                          {book.titre}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <p className="text-brown-700">
                          {book.auteur || <span className="text-brown-500 italic">Non renseigné</span>}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        {book.genre && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                            {book.genre}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <code className="bg-chocolate-50 text-brown-700 px-2 py-1 rounded font-mono text-sm">
                          {book.isbn}
                        </code>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-brown-700">
                            {book.numPages || '-'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-brown-700">
                        {book.numChapters || '-'}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-chocolate-100 rounded-full flex items-center justify-center">
                            <span className="text-brown-900 font-bold">
                              {book.numTotalLivres}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/biblio/livres/${book.idLivre}/modifier`)}
                            className="group relative p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden"
                            title="Modifier"
                          >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <Edit size={18} className="relative" />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(book.idLivre)}
                            className="group relative p-2 bg-gradient-to-r from-brown-600 to-chocolate-600 text-white rounded-lg hover:from-brown-700 hover:to-chocolate-700 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden"
                            title="Supprimer"
                          >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <Trash2 size={18} className="relative" />
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

        {/* Pied de page informatif */}
        {filteredBooks.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-brown-600 text-sm">
              Affichage de <span className="font-semibold text-chocolate-700">{filteredBooks.length}</span> ouvrage{filteredBooks.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AllBooks;