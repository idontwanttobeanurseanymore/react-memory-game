import "../styles/Footer.scss";

export default function Footer({ name, github, linkedin, email, post }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__socials">
          <a href={github} target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>
        <div className="footer__brand">
          <p>
            © {year} {name}
          </p>
        </div>
        <div className="footer__contact">
          <a href={post} target="_blank" rel="noopener noreferrer">
            <p className="footer__subtitle">Like, comment, and share</p>
          </a>
        </div>
      </div>
    </footer>
  );
}
