import Link from "next/link";
import AdminLoginForm from "./AdminLoginForm";
import styles from "./AdminLogin.module.css";

export const metadata = {
  title: "Admin Access | OSPREY Maritime Intelligence",
  description:
    "Secure authentication terminal for authorized OSPREY maritime surveillance, satellite SAR intelligence, and incident investigation personnel.",
};

export default function AdminLoginPage() {
  return (
    <div className={styles.loginPageContainer}>
      {/* Background Atmosphere */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />

      {/* Top Navigation */}
      <header className={styles.topNav}>
        <Link href="/" className={styles.backLink} title="Return to OSPREY Landing Page">
          <span className={styles.backArrow} aria-hidden="true">←</span>
          <span>Back to OSPREY</span>
        </Link>

        <div className={styles.statusIndicator} title="Security State">
          <span className={styles.statusDot} />
          <span>TERMINAL READY</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className={styles.mainContent}>
        <AdminLoginForm />
      </main>

      {/* Footer */}
      <footer className={styles.pageFooter}>
        <p className={styles.footerText}>
          OSPREY MARITIME INTELLIGENCE &bull; COPERNICUS &amp; AIS DATA INTEGRATION &bull; V1.0
        </p>
      </footer>
    </div>
  );
}
