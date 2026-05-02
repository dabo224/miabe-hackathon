import { useState } from 'react'
import './App.css'
import heroImg from './assets/hero.png'

interface VerificationResult {
  success: boolean;
  valide: boolean;
  message?: string;
  data: {
    idActe: string;
    prenom: string;
    nom: string;
    dateNaissance: string;
    lieuNaissance: {
      prefecture: string;
    };
    mere: { nom: string };
    pere?: { nom: string };
    txHash?: string;
    hashDonnees: string;
  };
  blockchainInfo: {
    date: string;
  };
}

function App() {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      const API_URL = 'https://61ab-2a01-e0a-b-f0e0-1234-5678-9abc-def0.ngrok-free.app/api';
      
      const response = await fetch(`${API_URL}/naissances/verify/${searchId}`, {
        headers: { 'Bypass-Tunnel-Reminder': 'true' }
      });
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || "Acte non trouvé.");
      }
    } catch (err) {
      setError("Erreur de connexion.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const regionalData = [
    { region: "Conakry", taux: "70% - 85%", niveau: "Élevé" },
    { region: "Kindia", taux: "50% - 65%", niveau: "Moyen" },
    { region: "Boké", taux: "45% - 60%", niveau: "Moyen" },
    { region: "Labé", taux: "40% - 55%", niveau: "Faible" },
    { region: "N'Zérékoré", taux: "30% - 45%", niveau: "Très faible" },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <a href="/" className="logo">NaissanceChain</a>
          <ul className="nav-links">
            <li><a href="#impact">Impact</a></li>
            <li><a href="#solution">Solution</a></li>
            <li><a href="#processus">Processus</a></li>
            <li><a href="#verification">Vérification</a></li>
          </ul>
        </div>
      </nav>

      <main>
        <header className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>L'identité numérique, un droit dès la naissance.</h1>
                <p>Nous utilisons la blockchain pour sécuriser l'avenir de chaque enfant en Guinée avec une certification inaltérable.</p>
              </div>
              <div className="hero-image-container">
                <img src={heroImg} alt="Illustration Hero" />
              </div>
            </div>
          </div>
        </header>

        <section id="impact">
          <div className="container">
            <div className="section-header">
              <span>Impact Social</span>
              <h2>L'urgence d'une identité pour tous.</h2>
            </div>
            <div className="stats-minimal">
              <div className="stat-item">
                <h3>58%</h3>
                <p>Taux d'enregistrement national</p>
              </div>
              <div className="stat-item">
                <h3>1.8M</h3>
                <p>Enfants sans identité juridique</p>
              </div>
              <div className="stat-item">
                <h3>#1</h3>
                <p>Obstacle à la scolarisation</p>
              </div>
            </div>

            <div className="impact-cards">
              <div className="impact-card">
                <h4>🎒 Accès à l'Éducation</h4>
                <p>Sans acte de naissance, un enfant ne peut pas passer les examens nationaux. Notre solution garantit le droit à l'éducation pour tous en fournissant une identité reconnue.</p>
              </div>
              <div className="impact-card">
                <h4>🛡️ Protection de l'Enfance</h4>
                <p>Une identité légale protège contre le travail des enfants, les mariages précoces et les trafics. C'est la première ligne de défense des droits humains.</p>
              </div>
              <div className="impact-card">
                <h4>📊 Planification de l'État</h4>
                <p>Des données démographiques fiables et immuables permettent au gouvernement d'allouer efficacement les ressources pour la santé et les infrastructures publiques.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="regional-analysis">
          <div className="container">
            <div className="section-header">
              <span>Analyse Régionale</span>
              <h2>Disparités territoriales</h2>
            </div>
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Région</th>
                  <th>Taux d'enregistrement</th>
                  <th>Niveau d'urgence</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '600' }}>{d.region}</td>
                    <td>{d.taux}</td>
                    <td>{d.niveau}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="solution">
          <div className="container">
            <div className="illustration-grid">
              <div className="illus-image">
                <img src="/exemple.jpeg" alt="Acte de Naissance Officiel" />
              </div>
              <div className="illus-text">
                <h3>De l'acte papier vers la certification immuable.</h3>
                <p>NaissanceChain transforme les processus traditionnels d'enregistrement civil en identités cryptographiques sécurisées. Fini les pertes de registres ou la falsification de documents essentiels.</p>
                <ul>
                  <li>Décentralisation pour éviter toute perte de registre central</li>
                  <li>Inaltérabilité prouvant l'authenticité de chaque document</li>
                  <li>Interopérabilité facilitant la vérification par les écoles ou banques</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="processus">
          <div className="container">
            <div className="section-header">
              <span>Le Processus</span>
              <h2>Comment ça fonctionne ?</h2>
            </div>
            <div className="process-grid">
              <div className="process-step">
                <span className="process-number">01</span>
                <h4>Déclaration sur le Terrain</h4>
                <p>Nos agents déploient l'application mobile même hors-ligne dans les villages pour collecter les données de naissance de manière fiable.</p>
              </div>
              <div className="process-step">
                <span className="process-number">02</span>
                <h4>Validation Préfectorale</h4>
                <p>Les données sont transmises à l'officier d'état civil qui vérifie et approuve officiellement la déclaration depuis un portail web sécurisé.</p>
              </div>
              <div className="process-step">
                <span className="process-number">03</span>
                <h4>Certification Blockchain</h4>
                <p>Une fois validées, les informations sont cryptées et ancrées sur la blockchain (Smart Contract), créant une preuve immuable.</p>
              </div>
              <div className="process-step">
                <span className="process-number">04</span>
                <h4>Accès et Vérification</h4>
                <p>La famille reçoit l'acte avec un QR Code. N'importe quelle institution peut flasher ce code pour vérifier instantanément son authenticité.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="verification">
          <div className="container">
            <div className="portal-minimal">
              <h2>Vérifiez l'authenticité d'un acte</h2>
              <form className="search-minimal" onSubmit={handleVerify}>
                <input 
                  type="text" 
                  placeholder="ID de l'acte (ex: GN-2026-12345)" 
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? '...' : 'Vérifier'}
                </button>
              </form>
              
              {result && result.valide && (
                <div style={{ marginTop: '3rem', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '20px' }}>
                  <p style={{ fontWeight: '700', color: '#00bfa5' }}>✓ ACTE AUTHENTIFIÉ</p>
                  <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>{result.data.prenom} {result.data.nom}</p>
                  <p style={{ opacity: 0.6 }}>Né(e) le {result.data.dateNaissance} à {result.data.lieuNaissance.prefecture}</p>
                </div>
              )}
              {error && <p style={{ marginTop: '2rem', color: '#ff4d4d' }}>{error}</p>}
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="features-minimal">
              <div className="feature-minimal-item">
                <h4>Mode Offline</h4>
                <p>Enregistrement possible sans connexion internet pour les zones rurales.</p>
              </div>
              <div className="feature-minimal-item">
                <h4>Blockchain</h4>
                <p>Sécurité maximale et immuabilité totale des données d'identité.</p>
              </div>
              <div className="feature-minimal-item">
                <h4>QR Code</h4>
                <p>Vérification instantanée pour les écoles et administrations.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-minimal">
        <div className="container">
          <p>© 2026 NaissanceChain — MIABE Hackathon. Innovation pour le futur de la Guinée.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
