"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'; // Am scos useEffect și useRef, nu mai avem nevoie de ele pentru decor
import SparkleManager from '../components/SparkleManager'; 
import Comments from '../components/Comments';

// --- DATELE ARTICOLELOR ---
const ARTICLES = [
  {
    id: 0,
    title: "Love Is Not All That Matters",
    date: "29 April, 2023",
    preview: "\"You're still thinking about it, right?\" ...",
    content: `“You're still thinking about it, right?”

These were the last words he heard from me on the day we were still together. Four words drowned in despair.

Two weeks later...
“Someday you'll look back and say 'thank god he broke up with me'. You know I'm right.”

...and he was right.

The moment has finally come for me to admit it. After weeks of denial, frustration, anxiety, and finally, acceptance, I can agree with him. He took a step that was so hard, yet so beneficial for both of us—a step I never would have had the courage to take. I would have stayed with him, no matter how hard it was.

Why? Because I couldn't imagine what it would be like without him.
We, as humans, are terrified of things we cannot anticipate. We always need at least a vague idea of what’s coming next. And when we don’t have that idea, we create it ourselves. Maybe that’s why we prefer to believe that God made humans from clay, and that the Apocalypse is the definitive end of this world. The fact that we know the world started somewhere and ends somewhere gives us a certainty that comforts us.
Just like that, this relationship was a certainty for me.

But that certainty shattered, and in its absence, I started seeing things clearly.

Since we broke up, I feel I’ve become a person with much deeper thinking. In fact, I always was. But the superficiality with which he viewed things made me repress it. He made me believe I was just too sensitive, too "dramatic." Until I realized that being sensitive is a blessing, not a curse. Not everyone can feel things so intensely, and the fact that I can makes me special, not hard to love.

I don't want to be a hypocrite. I made mistakes too. Oh, plenty of them! But if there’s one thing I think I did right, it’s that I always did what I felt. And when you follow your feelings, you know for sure you’re not moving forward with regrets.

I loved him, even though I somehow knew he wasn't right for me. And while he was buying me flowers and talking about moving in together next year, he was thinking about breaking up with me. We were in the same situation without knowing it. Or maybe we knew... but pretended not to see.

We are human, and we are difficult. Sometimes our emotions are contradictory, and we don't understand why. But that’s okay. Don't blame yourself for it. We are beings with thinking too complex and abstract to find it strange that we think this way. Allow yourself to feel everything you feel and embrace every emotion, whether positive, negative, or contradictory. At some point, you will look back and be grateful for everything you lived, even if no one understood you. Even if you probably didn't understand yourself at the time. You will look back and be able to say that you are a person with a unique and unmatched experience.

In this way, my belief that "love is all that matters in a relationship" was shattered. Love is not all that matters. And it shouldn't be.
When you think like that, you fall into a trap called "Things will change."
No, girl, they won't change!

Men aren't that hard to figure out. When a man really wants to be with you, he lets you know. In the same way, he lets you know when he doesn't want you anymore. And when he doesn't want you anymore, you have to leave, not pretend you don't notice. Because you are only hurting yourself. Sometimes, the happy ending isn’t getting back together, but both of you moving on.

Yes, it hurt. A person with whom I spent more than a quarter of my life left. And the reasons he left were even more painful. They made me ask questions like: "Is there something wrong with me? Am I a person a man can't be happy with?".
At first, my answers were yes. In the meantime, I woke up to reality.

So, what matters in a relationship?
Psychologically speaking, there are two main things:
* Chemistry (attraction to the other person)
* Compatibility (shared values and perspectives)

So, my next relationship will be based on both. And if it can't be... better not to be at all. As the saying goes: better nothing than something bad!

In the end, I learned a lot from this experience. Most importantly, I learned how to move on. And as a closing note, for anyone who needs to read this, I have the following message:

Instead of drowning your feelings in alcohol, cigarettes, clubs, and parties... Sit with them. Feel them and embrace them. Talk about them, don't hide them. Tell anyone you feel like telling. You will be surprised by some very good advice coming from people you don't expect. You will also be surprised by less good advice, but you will learn to choose between what is right and what is wrong. You will have examples of "yes, do this" and "no, don't do that."
And last but not least, you will be able to inspire the people around you, just as I hope I am managing to do now.`
  }
];

export default function ArticlesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // TRUC: Setăm un număr FIX și mare de decorațiuni (ex: 50).
  // CSS-ul (overflow: hidden) va ascunde surplusul automat.
  const decorCount = 11; 
  
  const [selectedArticle, setSelectedArticle] = useState<typeof ARTICLES[number] | null>(null);

  // Am șters complet useEffect-ul și useRef-urile complicate.
  // Lăsăm CSS-ul să facă treaba grea.

  return (
    <main className="min-h-screen bg-[#341c74]">
      <SparkleManager />
      
      {/* HEADER */}
      <div className="header">
        <h1 className="typewriter-title">d i n<span className="word-space"></span>t a s t e</h1> 
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <Image 
            src="/pixelcat.png" 
            className="image" 
            alt="Logo AZAX" 
            width={150} height={150} priority
          />
          <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
            <li className="list-item">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className="list-item">
              <Link href="/articles" onClick={() => {
                  setIsMenuOpen(false);
                  setSelectedArticle(null);
                }}>Articles</Link>
            </li>
            <li className="list-item">
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
        </div>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
      </nav>

      <div className="row">
        {/* COLOANA STÂNGA */}
        <div className="column1">
          <div id="d-wrapper">
              <div className="zig-zag-bottom"></div>
              <div className="sep1"><p></p></div>
              {[...Array(decorCount)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}></p></div>
              </React.Fragment>
            ))}
            <div className="zig-zag-top"></div>
          </div>
        </div>

        {/* COLOANA CENTRALĂ */}
        <div className="column2">
          
          {!selectedArticle ? (
            // --- LISTĂ ---
            <div className="articles-list fade-in " style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
              <h2 style={{ marginBottom: '40px', borderBottom: '2px solid #fe98ff', paddingBottom: '10px' }}>
                Articles
              </h2>
              {ARTICLES.map((art) => (
                <div 
                  key={art.id} 
                  onClick={() => setSelectedArticle(art)}
                  style={{ 
                    marginBottom: '30px', 
                    cursor: 'pointer',
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    transition: 'transform 0.2s, background 0.2s',
                    border: '1px solid transparent'
                  }}
                  className="article-preview-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = '#fe98ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <h3 style={{ color: '#fe98ff', fontSize: '1.5rem', marginBottom: '5px' }}>{art.title}</h3>
                  <span style={{ color: '#ccc', fontFamily: 'monospace', fontSize: '0.9rem' }}>{art.date}</span>
                  <p style={{ marginTop: '10px', color: '#ddd' }}>{art.preview} [Read more]</p>
                </div>
              ))}
            </div>

          ) : (
            // --- ARTICOL COMPLET ---
            <div className="single-article fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  background: 'transparent', border: '1px solid #fe98ff', color: '#fe98ff',
                  padding: '5px 15px', cursor: 'pointer', marginBottom: '20px',
                  fontFamily: 'monospace', fontSize: '1.1rem'
                }}
              >
                ← Back to list
              </button>

              <h2 style={{ fontSize: '2.5rem', color: '#fe98ff', marginBottom: '10px' }}>{selectedArticle.title}</h2>
              <p style={{ fontFamily: 'monospace', color: '#ccc', marginBottom: '40px' }}>{selectedArticle.date}</p>
              
              <div style={{ lineHeight: '1.8', fontSize: '1.2rem', textAlign: 'justify' }}>
                {selectedArticle.content.split('\n\n').map((para: string, idx: number) => (
                   <p key={idx} style={{ marginBottom: '20px', textIndent: '40px' }}>{para}</p>
                ))}
              </div>

              <div style={{ marginTop: '50px', textAlign: 'center', opacity: 0.6 }}>***</div>
              <div className="scroller">
                <Comments />
              </div>
            </div>
          )}
        </div>

        {/* COLOANA DREAPTA */}
        <div className="column3">
          <div id="d-wrapper">
            <div className="zig-zag-bottom"></div>
            <div className="sep1"><p></p></div>
            {[...Array(decorCount)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}></p></div>
              </React.Fragment>
            ))}
            <div className="zig-zag-top"></div>
          </div>
        </div>
      </div>

      <footer>
        <p>Ⓒ 2025 din taste</p>
      </footer>
    </main>
  );
}