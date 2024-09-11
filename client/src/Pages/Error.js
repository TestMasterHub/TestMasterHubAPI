import { Link, useRouteError } from "react-router-dom";
import styles from '../Styles/PageStyles/ErrorPage.module.css'
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  // Fallback values if error properties are undefined
  const status = error?.status || "Unknown Error";
  const statusText = error?.statusText || "An unexpected error occurred";
  const message = status === 404 
    ? "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
    : "Check your Internet";
    return (
    <div className={styles.ErrorPage}>
      <div className={styles.OopsStyple}>
        <h1 className={styles.ErrroHeading}>Oops!</h1>
      </div>
      <div className={styles.Errormessage}>
        {status ? <h2>{status}-{statusText}<p>{message}</p></h2> :""}
        {
          status === 404 ?(<button className={styles.LinkButton}>
          <Link to="/" className={styles.LinkText}>
            GO TO HOMEPAGE
          </Link>
        </button>) :("")
        }
      </div>
    </div>
  );
}
