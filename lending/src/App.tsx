'use client'

import { useState } from 'react'

type Theme = 'dark' | 'light'

const asset = (path: string) => `/redblue/${path.replace(/^\//, '')}`

const nav = [
  ['Для кого', 'about'], ['Форматы', 'formats'], ['Расписание', 'schedule'],
  ['Спикеры', 'team'], ['Отзывы', 'reviews'], ['Блог', 'blog'], ['FAQ', 'faq'],
]

const people = [
  [asset('assets/figma/people/speaker-1-speaker1.png'), 'Алина', 'Ведущая разговорного клуба'],
  [asset('assets/figma/people/speaker-2-speaker2.png'), 'Мария', 'Куратор форматов'],
  [asset('assets/figma/people/speaker-3-speaker3.png'), 'Никита', 'Спикер клуба'],
  [asset('assets/source/img_4c42c1fc608a.png'), 'Екатерина', 'Ведущая встреч'],
]

const events = ['Discussion: habits that shape us', 'Speaking club: travelling', 'Debates: AI and creativity', 'Casual talk: favourite places']

function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <main className={`site-shell theme-${theme}`} id="top">
    <header className="header">
      <button className="logo" onClick={() => scrollTo('top')} aria-label="RED and BLUE Talk">
        <span className="logo-dot"><i /><b /></span><span>RED <em>&amp;</em> BLUE</span>
      </button>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
        {nav.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
      </nav>
      <div className="header-tools">
        <button className="join-button header-join" onClick={() => scrollTo('join')}>Присоединиться</button>
        <button className="theme-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Сменить тему">{theme === 'dark' ? '☼' : '◐'}</button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">{menuOpen ? '×' : '☰'}</button>
      </div>
    </header>

    <section className="hero">
      <div className="container hero-layout">
        <div className="hero-heading">
          <h1>English</h1>
          <p className="hero-title">на котором ты наконец заговоришь</p>
        </div>
        <p className="hero-description">Бесплатный спикинг-клуб, где подростки и студенты могут преодолеть языковой барьер.<br />Главное просто начать!</p>
        <div className="iceberg-viewport">
          <div className="iceberg-scene" aria-label="Путь от точки А к точке Б">
            <img className="iceberg-art" src={asset('assets/source/img_d84cb49df496.png')} alt="" />
            <svg className="route-line" viewBox="0 0 1442 2140" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M599 621 C688 708 635 766 766 838 S944 947 843 1032 S765 1173 986 1230" /></svg>
            <span className="route-point point-a">Точка А</span>
            <span className="route-card route-no-barrier">Нет барьеру!</span>
            <span className="route-card route-lexicon">Полезная лексика</span>
            <span className="route-card route-friends">Новые знакомства</span>
            <span className="route-card route-dialogue">Умение вести диалог</span>
            <span className="route-point point-b">Точка Б</span>
          </div>
        </div>
      </div>
    </section>

    <section id="about" className="section intro-section">
      <div className="container">
        <p className="intro-lead">Учить не молчать. С нами вы сможете</p>
        <div className="break-line"><i>Break the ice</i><img src={asset('assets/source/img_7adbde4f9225.png')} alt="" /><span>в любом разговоре</span></div>
        <h2>У нас 100% мэтч, если</h2>
        <div className="pain-grid">
          {['Ты 11 лет учил английский, но так и не получается говорить свободно.', 'У тебя больше пассивного изучения, чем активного.', 'Ты боишься, что совершишь ошибку и будешь смешно звучать.'].map((text, i) => <article key={text} className="glass-card"><strong>0{i + 1}</strong><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="facts"><div className="container facts-line"><i>Free</i><img src={asset('assets/source/img_7adbde4f9225.png')} alt=""/><i>3 meetings</i><img src={asset('assets/source/img_7adbde4f9225.png')} alt=""/><i>1 hour</i><img src={asset('assets/source/img_7adbde4f9225.png')} alt=""/><i>6–8 people</i></div></section>

    <section id="formats" className="section levels"><div className="container"><h2>Занятия для любого уровня</h2><div className="level-grid"><article className="level-tall"><b>Beginner</b><p>Начинаем с основ: спокойно, в маленькой группе и без страха ошибиться.</p></article><article><b>Intermediate</b><p>Развиваем речь, лексику и уверенность в живых диалогах.</p></article><article><b>Advanced</b><p>Спорим, аргументируем и говорим на сложные темы.</p></article><article className="level-wide"><b>Для каждого найдётся свой разговорный формат</b></article></div></div></section>

    <section className="section format-section"><div className="container format-banner"><div><h2>Форматы встреч</h2><p>Научишься аргументировать, отстаивать свою точку зрения и мыслить критически</p><div className="level-tags"><span>Beginner</span><span>Intermediate</span><span>Advanced</span></div></div><div className="format-stack"><i>Debates</i><b>Casual talk</b><i>Neo talk</i></div></div></section>

    <section id="schedule" className="section schedule"><div className="container"><h2>Расписание на ближайшие 7 дней</h2><div className="filters"><button>◷ Время⌄</button><button>☷ Intermediate⌄</button><button>Debates⌄</button></div><p className="date">Сегодня, 06 Августа</p><div className="event-grid">{events.map((event, i) => <article className="event-card" key={event}><small>19:00 – 20:00</small><div className="event-image">{i === 0 && <img src={asset('assets/source/img_4c42c1fc608a.png')} alt=""/>}</div><p><span /> Екатерина</p><b>{event}</b></article>)}</div></div></section>

    <section id="team" className="section team"><div className="container"><div className="section-row"><h2>Наша команда</h2><div className="arrows"><button>←</button><button>→</button></div></div><div className="people-grid">{people.map(([image, name, description], i) => <article className={i % 2 ? 'person blue-person' : 'person'} key={name}><div className="person-tags"><span>C1</span><span>SAT</span></div><h3>{name}</h3><p>{description}</p><img src={image} alt={name} /></article>)}</div></div></section>

    <section id="reviews" className="section reviews"><div className="container"><h2>Истории успеха наших учеников</h2><div className="review-layout"><img src={asset('assets/figma/people/speaker-1-speaker1.png')} alt="Николя Ермолаев"/><article><b>Николя Ермолаев</b><blockquote>«Мне не с кем было попрактиковаться, а через 3 месяца мне сдавать IELTS»</blockquote><p>Попал в Red&amp;Blue Talk через соцсети, думал очередной разговорный клуб, где нет обратной связи, а получилось наоборот.</p><a href="#reviews">Читать полностью</a></article></div></div></section>

    <section id="blog" className="section blog"><div className="container"><h2>Мы ведем блог, вы знали?</h2><div className="blog-feature"><div><p>И это может помочь вам готовиться к экзаменам. Говорим о том, о чем даже мы не знали</p><div className="tags"><span>vocabulary</span><span>speaking</span><span>travelling</span><span>events</span></div></div><button className="round-arrow">↗</button></div><div className="blog-grid">{['OMG new words in the Cambridge Dictionary!', 'How to speak naturally', 'Travel English without stress'].map(title => <article key={title}><div /><small>2nd September 2026</small><b>{title}</b></article>)}</div></div></section>

    <section id="join" className="section join"><div className="container join-layout"><div><p>Мы ищем</p><div className="roles"><span>Маркетолога</span><span>Куратора</span><span>Спикера</span></div><h2>Ждем вас в нашей команде</h2><i>Fill in the form and we will contact you!</i></div><form onSubmit={event => { event.preventDefault(); setSent(true) }}><label>Ваше имя<input name="name" required /></label><label>Телеграмм<input name="telegram" required /></label><button className="apply" type="submit">{sent ? 'Отправлено' : 'Apply'}</button><small>{sent ? 'Заявка сохранена в этом браузере. Интеграция отправки пока не подключена.' : 'Нажимая Apply, вы соглашаетесь на обработку данных.'}</small></form></div></section>
    <footer id="faq" className="footer"><div className="container"><button className="logo" onClick={() => scrollTo('top')}><span className="logo-dot"><i /><b /></span><span>RED <em>&amp;</em> BLUE</span></button><p>Speaking club for people who want to talk.</p></div></footer>
  </main>
}

export default App
