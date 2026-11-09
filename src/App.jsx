import { useEffect, useState } from 'react';
import Scene from './Scene.jsx';
import { initEffects } from './effects.js';
import { VERSES, NAV, PATH } from './data.js';

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initEffects();                                   // reveal, nav, contador, cursor, tilt...
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setReady(true), reduce ? 0 : 2300);   // fin de la splash
    return () => clearTimeout(t);
  }, []);
  const hero = `rv${ready ? ' in' : ''}`;

  return (<>
    <div className={`splash${ready ? ' out' : ''}`} aria-hidden="true">
      <img src="logo.png" alt="" className="splash-logo" />
      <h1>Instituto al Mundo</h1><p>Brandon Lacayo</p>
    </div>

    <div className="bg" aria-hidden="true">
      <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
      <Scene /><div className="spot" id="spot" /><div className="grain" />
    </div>
    <div className="cursor" id="cursor" aria-hidden="true" />
    <div className="progress" id="progress" aria-hidden="true" />
    <div className="counter" id="counter" aria-live="polite"><b id="cur">01</b> / 05</div>

    <nav className="nav" aria-label="Principal">
      {NAV.map(([id, ico, label], i) => <a key={id} href={`#${id}`} className={i === 0 ? 'on' : ''}><i>{ico}</i><span>{label}</span></a>)}
    </nav>

    <main>
      <section className="hero" id="inicio">
        <img src="logo.png" alt="Logo Instituto al Mundo" className={`hero-logo ${hero}`} />
        <p className={`kicker ${hero}`}>Instituto de Liderazgo al Mundo</p>
        <h2 className={`title${ready ? ' go' : ''}`} aria-label="Reconciliación e Intercesión">
          <span className="w">Reconciliación</span> <span className="w">e</span> <span className="w">Intercesión</span>
        </h2>
        <p className={`sub ${hero}`}>Tarea 1 y Tarea 2 · Clase de nuestra Pastora</p>
        <div className={`meta ${hero}`}><span>Brandon Lacayo</span><span className="dot" /><span>9 de noviembre de 2026</span></div>
        <a href="#reconciliacion" className={`btn mag ${hero}`}>Comenzar</a>
        <div className="scrollhint" aria-hidden="true" />
      </section>

      <section id="reconciliacion" className="sec">
        <p className="num rv">01 — Reconciliación</p>
        <blockquote className="verse-top rv">“Si usted se siente ofendido con alguien, vaya y reconcíliese con esa persona.”</blockquote>
        <div className="glass card3d rv">
          <p>Actualmente me encuentro bien con las personas a mi alrededor y no tengo una ofensa o conflicto pendiente que requiera una reconciliación específica. Por eso no quiero inventar una historia: prefiero responder con honestidad desde donde estoy hoy.</p>
          <p>Sin embargo, esta enseñanza me recuerda que la reconciliación no solamente se practica cuando existe un conflicto. También implica mantener un corazón dispuesto a perdonar, reconocer mis errores, pedir perdón cuando sea necesario y procurar vivir en paz con los demás.</p>
          <p>No lo veo como una tarea que no me corresponde, sino como una actitud que cuido desde ahora para que, el día que haga falta, mi corazón ya esté preparado.</p>
        </div>
        <ol className="path rv" aria-label="Camino de la reconciliación">
          {PATH.map(([b, s]) => <li key={b}><b>{b}</b><small>{s}</small></li>)}
        </ol>
      </section>

      <section id="intercesion" className="sec">
        <p className="num rv">02 — Intercesión</p>
        <h2 className="h2 rv">Orar por otros es ponerse en la brecha</h2>
        <p className="lead rv">Interceder es hablar con Dios a favor de alguien más. Investigué cinco textos bíblicos (Reina-Valera 1960) que muestran cómo la intercesión aparece desde Abraham hasta Jesús, y qué puedo aprender de cada uno.</p>
        {VERSES.map((v, i) => (
          <article key={v.ref} className={`verse glass${i % 2 ? ' alt' : ''}`} data-n={i + 1}>
            <div className="vn">0{i + 1}</div>
            <h3 className="ref">{v.ref}</h3>
            <p className="ref-sub">{v.sub}</p>
            <blockquote className="text">{v.text}</blockquote>
            <div className="blk"><h4>¿Qué enseña?</h4><p>{v.teaches}</p></div>
            <div className="blk"><h4>Mi reflexión</h4><p>{v.mine}</p></div>
            <div className="blk"><h4>Qué aplico a mi vida</h4><p>{v.apply}</p></div>
          </article>
        ))}
      </section>

      <section id="reflexion" className="sec">
        <p className="num rv">03 — Reflexión</p>
        <h2 className="h2 rv">Por qué importa la intercesión</h2>
        <div className="glass card3d rv">
          <p>Después de estudiar estos cinco textos, entiendo que la intercesión es una forma de amor práctico. Abraham pidió por otros, Jesús oró por quienes lo lastimaban, Pablo la puso como prioridad y Santiago la unió al perdón.</p>
          <p>Orar por alguien cambia primero mi propio corazón: me saca del egoísmo, me da compasión y me enseña a depender de Dios. Y también me recuerda que nadie debería caminar solo, porque otros también interceden por mí.</p>
        </div>
      </section>

      <section id="conclusion" className="sec final">
        <div className="light" aria-hidden="true" />
        <p className="num rv">04 — Conclusión</p>
        <h2 className="title2 rv">Reflexión final</h2>
        <div className="chain rv"><span>Reconciliación</span><i>+</i><span>Perdón</span><i>+</i><span>Intercesión</span><i>+</i><span>Oración</span></div>
        <p className="lead rv">Esta tarea me dejó claro que no necesito un conflicto para practicar la reconciliación. Puedo vivir preparado: perdonando rápido, pidiendo perdón con humildad y orando por los demás.</p>
        <p className="lead rv">Quiero que mi crecimiento espiritual se note en cómo trato a las personas y en las oraciones que hago cuando nadie me ve.</p>
        <p className="quote rv">“Que nuestra vida sea una expresión de amor, perdón y oración por los demás.”</p>
        <p className="sign rv">Instituto de Liderazgo al Mundo</p>
      </section>
    </main>
  </>);
}
