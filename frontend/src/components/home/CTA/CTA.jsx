import { Link } from "react-router-dom";
import { FaArrowRight, FaPenNib } from "react-icons/fa6";

import "./CTA.css";

function CTA() {
  return (
    <section className="lumora-writer-cta">
      <div className="lumora-writer-cta__container">
        <div className="lumora-writer-cta__content">

          <div className="lumora-writer-cta__icon">
            <FaPenNib size={18} />
          </div>

          <span className="lumora-writer-cta__eyebrow">
            FOR WRITERS
          </span>

          <h2>
            Have a story to tell?
          </h2>

          <p>
            Share your imagination with readers who are waiting
            for their next story. Write, publish and build your
            audience on Lumora.
          </p>

          <div className="lumora-writer-cta__actions">

            <Link
              to="/become-writer"
              className="lumora-writer-cta__primary"
            >
              Start Writing
              <FaArrowRight size={11} />
            </Link>

            <Link
              to="/become-writer"
              className="lumora-writer-cta__secondary"
            >
              Learn more
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}

export default CTA;