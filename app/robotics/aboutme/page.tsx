"use client";
// Importă noul layout
import PageLayout from '../components/PageLayout';
import PageTurn from '../components/PageTurn'; 

export default function AboutMe() {
  // Aici stabilești câte decorațiuni vrei pentru Home
  const decorForHome = 3;
  
  return (
    <PageLayout decorCount={decorForHome}>
       {/* Tot ce pui aici va apărea automat în coloana centrală */}
       <PageTurn>
            <div className="fade-in">
              <h2 style={{fontSize: '2rem', paddingLeft: '40px', marginBottom: '40px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
                About me 
              </h2> 
              
              <div style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em' }}> 
              
                 {/* --- AL DOILEA POST-IT (Roz, Stânga) - Focus pe Proces --- */}
                <div className="sticky-note pink">
                  ⚙️ <strong>Current Status:</strong>
                 <br/>
                  It does exactly what
                  <br/>
                  I told it to (sadly).
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  You&apos;ve landed in the workspace of a <strong>Robotics Master&apos;s student</strong>. This isn&apos;t just a portfolio. It&apos;s a documentation of my academic journey into the world of robotics and automation.
                </p> 
                
                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  <span className="highlight-text">This platform is an <strong>open-source lab notebook</strong>.</span> Here you&apos;ll find topics I am actively learning, along with documented explanations meant to help readers who are new to robotics. The focus is on understanding how things work, step by step. Concepts like robot motion, coordinate systems, and basic modeling are introduced gradually, with formulas explained in plain language.
                </p>

                {/* --- PRIMUL POST-IT (Galben, Dreapta) - Focus Tehnic --- */}
                <div className="sticky-note yellow">
                  📌 <strong>Reminder:</strong>
                  <br/>
                  Learning in public. 
                  <br/>
                  Mistakes may be included.
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  This space reflects my own learning process, but it is designed to be welcoming to inexperienced readers. You don&apos;t need an advanced background to follow along. The goal is to build intuition first, then deepen understanding at your own pace.
                </p> 

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  This is not a formal course or a finished reference. It is a shared learning space. It is a place to explore industrial robotics from the ground up, through explanation and simulation.
                </p>

              </div> 

            </div>
       </PageTurn>
    </PageLayout>
  );
}