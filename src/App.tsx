import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import Coaches from '@/components/Coaches';
import ContactMap from '@/components/ContactMap';
import FAQ from '@/components/FAQ';
import FloatingContact from '@/components/FloatingContact';
import LoadingScreen from '@/components/LoadingScreen';
import Footer from '@/components/Footer';
import StartJourney from '@/components/StartJourney';
import Testimonials from '@/components/Testimonials';
import TrainingEnvironment from '@/components/TrainingEnvironment';
import { useReveal } from '@/lib/reveal';
import { ZALO_CTA_HREF } from '@/lib/site';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Leaf,
  Menu,
  Phone,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'GIỚI THIỆU', href: '#giới-thiệu' },
  { label: 'THAY ĐỔI', href: '#thay-đổi' },
  { label: 'MÔI TRƯỜNG', href: '#môi-trường-tập-luyện' },
  { label: 'DỊCH VỤ', href: '#bat-dau-hanh-trinh' },
  { label: 'HUẤN LUYỆN VIÊN', href: '#dong-hanh-cung-ban' },
  { label: 'LIÊN HỆ', href: '#địa-chỉ' },
];

const features = [
  { label: ['KHÔNG GIAN', 'THOÁNG MÁT'], icon: Leaf },
  { label: ['THIẾT BỊ', 'HIỆN ĐẠI'], icon: Dumbbell },
  { label: ['CỘNG ĐỒNG', 'TÍCH CỰC'], icon: Users },
  { label: ['AN TOÀN', 'VÀ CHUYÊN NGHIỆP'], icon: ShieldCheck },
];

const slideshowImages = [
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787475435/left.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787476521/inside4.png',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787476521/inside5.png',
];

const aboutImages = [
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787480771/FACILITY_1.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787480768/FACILITY_6.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787480767/FACILITY_4.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787480767/FACILITY_5.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787480766/FACILITY_3.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/v1787480765/FACILITY_2.jpg',
];

const femaleImages = [
  'https://res.cloudinary.com/iq7pkdiu/image/upload/ketqua_7.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/ketqua_8.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/ketqua_9.jpg',
];

const maleImages = [
  'https://res.cloudinary.com/iq7pkdiu/image/upload/ketqua_3.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/ketqua_1.jpg',
  'https://res.cloudinary.com/iq7pkdiu/image/upload/ketqua_2.jpg',
];

const HERO_SLIDE_INTERVAL = 5000;

function getSlidesToShow(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth <= 640) return 1.25;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function useDragCarousel(maxSlide: number) {
  const [slide, setSlide] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const next = () => setSlide((prev) => Math.min(prev + 1, maxSlide));
  const previous = () => setSlide((prev) => Math.max(prev - 1, 0));

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setDragStart(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStart === null) return;
    const distance = event.clientX - dragStart;
    if (Math.abs(distance) > 45) {
      if (distance < 0) next();
      else previous();
    }
    setDragStart(null);
  };

  return { slide, setSlide, next, previous, handlePointerDown, handlePointerUp, setDragStart };
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [aboutSlide, setAboutSlide] = useState(0);
  const [aboutSlidesToShow, setAboutSlidesToShow] = useState(getSlidesToShow);
  const [aboutMobileTranslate, setAboutMobileTranslate] = useState(0);
  const [navState, setNavState] = useState<'hero' | 'visible' | 'hidden'>('hero');
  const lastScrollY = useRef(0);
  const isNavScrolling = useRef(false);
  const navScrollSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutIntroRef = useReveal<HTMLDivElement>();
  const aboutCarouselRef = useReveal<HTMLDivElement>();
  const aboutTrackRef = useRef<HTMLDivElement | null>(null);
  const transformIntroRef = useReveal<HTMLDivElement>();
  const femaleCaseRef = useReveal<HTMLDivElement>();
  const maleCaseRef = useReveal<HTMLDivElement>();

  const femaleCarousel = useDragCarousel(femaleImages.length - 1);
  const maleCarousel = useDragCarousel(maleImages.length - 1);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % slideshowImages.length);
    }, HERO_SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [heroSlide]);

  useEffect(() => {
    const handleResize = () => setAboutSlidesToShow(getSlidesToShow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const maxSlide = Math.max(0, Math.ceil(aboutImages.length - aboutSlidesToShow));
    setAboutSlide((current) => Math.min(current, maxSlide));
  }, [aboutSlidesToShow]);

  useEffect(() => {
    if (aboutSlidesToShow % 1 === 0) {
      setAboutMobileTranslate(0);
      return;
    }

    const viewport = aboutCarouselRef.current;
    const track = aboutTrackRef.current;
    if (!viewport || !track) return;

    const updateTranslate = () => {
      const firstImage = track.querySelector<HTMLElement>('.about-image');
      if (!firstImage) return;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      const step = firstImage.getBoundingClientRect().width + gap;
      const maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setAboutMobileTranslate(Math.min(aboutSlide * step, maxTranslate));
    };

    updateTranslate();
    const observer = new ResizeObserver(updateTranslate);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [aboutSlide, aboutSlidesToShow]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;

        // While a nav-link-triggered smooth scroll is in flight, don't let the
        // direction-based auto hide/show logic touch navState — otherwise the
        // header hides itself mid-scroll and the offset we reserved for it
        // gets exposed as "leftover" content from the section above.
        if (isNavScrolling.current) {
          lastScrollY.current = y;
          ticking = false;
          return;
        }

        if (y < 100) {
          setNavState('hero');
        } else if (y > lastScrollY.current + 8) {
          setNavState('hidden');
        } else if (y < lastScrollY.current - 8) {
          setNavState('visible');
        }
        lastScrollY.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (navScrollSettleTimer.current) clearTimeout(navScrollSettleTimer.current);
    };
  }, []);

  const maxAboutSlide = Math.max(0, Math.ceil(aboutImages.length - aboutSlidesToShow));

  const goToNextHeroSlide = () => setHeroSlide((prev) => (prev + 1) % slideshowImages.length);
  const goToNextAboutSlide = () => setAboutSlide((prev) => Math.min(prev + 1, maxAboutSlide));
  const goToPreviousAboutSlide = () => setAboutSlide((prev) => Math.max(prev - 1, 0));

  const handleAboutPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setAboutDragStart(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleAboutPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (aboutDragStart === null) return;
    const distance = event.clientX - aboutDragStart;
    if (Math.abs(distance) > 45) {
      if (distance < 0) goToNextAboutSlide();
      else goToPreviousAboutSlide();
    }
    setAboutDragStart(null);
  };

  const [aboutDragStart, setAboutDragStart] = useState<number | null>(null);

  const handleNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setMenuOpen(false);

    const target = document.querySelector(href);
    if (!target) return;

    // Lock the header in its "visible" (compact) state and stop the
    // scroll-direction auto-hide logic from touching navState until this
    // programmatic scroll has fully settled. Otherwise the header hides
    // itself partway through the smooth scroll (since we're scrolling
    // down), and the space we reserved for it ends up showing the tail
    // end of the previous section instead.
    isNavScrolling.current = true;
    setNavState('visible');

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, targetTop - headerHeight),
      behavior: 'smooth',
    });

    if (navScrollSettleTimer.current) clearTimeout(navScrollSettleTimer.current);

    // Poll-ish settle check: wait until scrollY stops changing for a short
    // beat, then hand control back to the normal scroll-direction logic.
    let lastY = window.scrollY;
    const checkSettled = () => {
      const y = window.scrollY;
      if (y === lastY) {
        isNavScrolling.current = false;
        lastScrollY.current = y;
        return;
      }
      lastY = y;
      navScrollSettleTimer.current = setTimeout(checkSettled, 100);
    };
    navScrollSettleTimer.current = setTimeout(checkSettled, 100);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <main className={`site-page ${isLoading ? 'is-loading' : ''}`}>
      <FloatingContact />

      <section className="hero-shell" id="top">
        <header className={`site-header nav-${menuOpen ? 'visible' : navState}`}>
          <a className="brand" href="/" aria-label="Chill Gym trang chủ">
            <span>CHILL</span>
            <strong>GYM</strong>
          </a>

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <a
                href={item.href}
                key={item.label}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="header-phone" href="tel:0704952969" aria-label="Gọi 070 495 2969">
              <Phone size={13} strokeWidth={1.6} />
              <span>070 495 2969</span>
            </a>
            <a className="header-cta" href={ZALO_CTA_HREF} target="_blank" rel="noreferrer">
              ĐĂNG KÝ TẬP THỬ
            </a>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </header>

        <section className="hero-image-panel" aria-label="Không gian Chill Gym">
          <div className="hero-slideshow">
            {slideshowImages.map((src, index) => (
              <div
                className={`hero-slide ${index === heroSlide ? 'is-active' : ''}`}
                key={src}
                style={{ backgroundImage: `url('${src}')` }}
                aria-hidden={index !== heroSlide}
              />
            ))}
          </div>
          <div className="image-overlay" />
          <button className="hero-next" type="button" onClick={goToNextHeroSlide} aria-label="Ảnh tiếp theo">
            <ArrowRight size={22} strokeWidth={1.35} />
          </button>

          <div className="hero-copy">
            <div className="hero-fade hero-fade-1 google-review-badge" aria-label="Google 4.8 sao, 1278 đánh giá">
              <span>GOOGLE</span>
              <span className="google-review-stars" aria-hidden="true">★★★★★</span>
              <strong>4.8</strong>
              <span>·</span>
              <span>1278 đánh giá</span>
            </div>
            <h1 className="hero-fade hero-fade-2 hero-heading">
              <span className="hero-heading-line">TẬP BAO <em>CHILL</em>,</span>
              <span className="hero-heading-line">KẾT QUẢ BAO <em>REAL</em>.</span>
            </h1>
            <p className="hero-fade hero-fade-3 hero-description">
              Không gian hiện đại, thoáng mát với cây xanh, thiết bị cao cấp và cộng đồng năng lượng tích cực.
              Chill nhưng không chill với mục tiêu của bạn.
            </p>
            <div className="hero-fade hero-fade-4 hero-actions">
              <a className="button button-primary" href={ZALO_CTA_HREF} target="_blank" rel="noreferrer">
                ĐĂNG KÝ TẬP THỬ <ArrowRight size={17} strokeWidth={1.7} />
              </a>
              <a className="button button-secondary" href={ZALO_CTA_HREF} target="_blank" rel="noreferrer">
                TƯ VẤN MIỄN PHÍ
              </a>
            </div>
          </div>

          <div className="feature-row" aria-label="Điểm nổi bật">
            {features.map(({ label, icon: Icon }, index) => (
              <div className={`hero-fade hero-fade-${5 + index} feature`} key={label[0]}>
                <Icon className="feature-icon" size={25} strokeWidth={1.25} />
                <span>
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside className="video-panel" aria-label="Chill Gym daily vlog">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://res.cloudinary.com/iq7pkdiu/image/upload/v1787475435/left.jpg"
          >
            <source src="https://res.cloudinary.com/iq7pkdiu/video/upload/v1787474345/Hero-Edited-handbreak.mp4" type="video/mp4" />
          </video>
          <div className="video-shade" />
          <div className="scroll-prompt">
            <span>SCROLL</span>
            <div className="scroll-circle"><ArrowDown size={19} strokeWidth={1.4} /></div>
          </div>
        </aside>
      </section>

      <section className="about-section" id="giới-thiệu" aria-labelledby="about-heading">
        <div className="about-intro reveal" ref={aboutIntroRef}>
          <div>
            <p className="section-kicker">VỀ CHILL GYM</p>
            <h2 id="about-heading">TẬP HARD NHƯNG VẪN <em>"CHILL"</em></h2>
          </div>
          <p className="about-description">Gym chuyên nghiệp tại Thuận An, phù hợp cho cả nam và nữ.</p>
        </div>

        <div
          className="about-carousel reveal"
          ref={aboutCarouselRef}
          onPointerDown={handleAboutPointerDown}
          onPointerUp={handleAboutPointerUp}
          onPointerCancel={() => setAboutDragStart(null)}
          onPointerLeave={() => setAboutDragStart(null)}
        >
          <div
            className="about-track"
            ref={aboutTrackRef}
            style={{
              transform: aboutSlidesToShow % 1 === 0
                ? `translateX(calc(-${aboutSlide} * ((100% + var(--about-gap)) / var(--about-slides))))`
                : `translateX(-${aboutMobileTranslate}px)`,
            }}
          >
            {aboutImages.map((src, index) => (
              <figure className="about-image" key={src}>
                <img src={src} alt={`Không gian Chill Gym ${index + 1}`} loading={index < 3 ? 'eager' : 'lazy'} draggable="false" />
              </figure>
            ))}
          </div>
        </div>

        <div className="about-controls">
          <div className="about-arrows">
            <button type="button" onClick={goToPreviousAboutSlide} disabled={aboutSlide === 0} aria-label="Ảnh trước">
              <ArrowLeft size={19} strokeWidth={1.4} />
            </button>
            <button type="button" onClick={goToNextAboutSlide} disabled={aboutSlide === maxAboutSlide} aria-label="Ảnh tiếp theo">
              <ArrowRight size={19} strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </section>

      <section className="transform-section" id="thay-đổi" aria-labelledby="transform-heading">
        <div className="transform-intro reveal" ref={transformIntroRef}>
          <p className="section-kicker">KẾT QUẢ THỰC</p>
          <h2 id="transform-heading">HÀNH TRÌNH <em>THAY ĐỔI</em></h2>
        </div>

        <article className="transform-case reveal" ref={femaleCaseRef}>
          <div className="case-label">
            <span className="case-number">CASE 01</span>
            <span className="case-gender">NỮ</span>
          </div>
          <div
            className="transform-carousel"
            onPointerDown={femaleCarousel.handlePointerDown}
            onPointerUp={femaleCarousel.handlePointerUp}
            onPointerCancel={() => femaleCarousel.setDragStart(null)}
            onPointerLeave={() => femaleCarousel.setDragStart(null)}
          >
            <div className="transform-track" style={{ transform: `translateX(-${femaleCarousel.slide * 100}%)` }}>
              {femaleImages.map((src, index) => (
                <figure className="transform-image" key={src}>
                  <img src={src} alt={`Hành trình thay đổi nữ ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} draggable="false" />
                </figure>
              ))}
            </div>
          </div>
          <div className="transform-arrows">
            <button type="button" onClick={femaleCarousel.previous} disabled={femaleCarousel.slide === 0} aria-label="Ảnh trước">
              <ArrowLeft size={20} strokeWidth={1.4} />
            </button>
            <button type="button" onClick={femaleCarousel.next} disabled={femaleCarousel.slide === femaleImages.length - 1} aria-label="Ảnh tiếp theo">
              <ArrowRight size={20} strokeWidth={1.4} />
            </button>
          </div>
        </article>

        <article className="transform-case reveal" ref={maleCaseRef}>
          <div className="case-label">
            <span className="case-number">CASE 02</span>
            <span className="case-gender">NAM</span>
          </div>
          <div
            className="transform-carousel"
            onPointerDown={maleCarousel.handlePointerDown}
            onPointerUp={maleCarousel.handlePointerUp}
            onPointerCancel={() => maleCarousel.setDragStart(null)}
            onPointerLeave={() => maleCarousel.setDragStart(null)}
          >
            <div className="transform-track" style={{ transform: `translateX(-${maleCarousel.slide * 100}%)` }}>
              {maleImages.map((src, index) => (
                <figure className="transform-image" key={src}>
                  <img src={src} alt={`Hành trình thay đổi nam ${index + 1}`} loading="lazy" draggable="false" />
                </figure>
              ))}
            </div>
          </div>
          <div className="transform-arrows">
            <button type="button" onClick={maleCarousel.previous} disabled={maleCarousel.slide === 0} aria-label="Ảnh trước">
              <ArrowLeft size={20} strokeWidth={1.4} />
            </button>
            <button type="button" onClick={maleCarousel.next} disabled={maleCarousel.slide === maleImages.length - 1} aria-label="Ảnh tiếp theo">
              <ArrowRight size={20} strokeWidth={1.4} />
            </button>
          </div>
        </article>
      </section>

      <TrainingEnvironment />
      <StartJourney />
      <Coaches />
      <Testimonials />
      <FAQ />
      <ContactMap />
      <Footer />
      </main>
    </>
  );
}

export default App;
