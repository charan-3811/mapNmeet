import { Link } from "react-router-dom";

export function NavBar() {
    return (
        <nav style={styles.navbar}>
            <h1 style={styles.logo}>mapNmeet</h1>
            <div style={styles.navLinks}>
                <Link to="/" style={styles.link}>
                    <button style={styles.button}>Home</button>
                </Link>
                <Link to="/profiles" style={styles.link}>
                    <button style={styles.button}>Profiles</button>
                </Link>
                <Link to="/addProfile" style={styles.link}>
                    <button style={styles.button}>Add Profile</button>
                </Link>
            </div>
        </nav>
    );
}

// **CSS-in-JS Styles**
const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
        backgroundColor: "rgba(118, 247, 150, 0.68)",
        color: "#fff",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        
    },
    logo: {
        fontSize: "22px",
        fontWeight: "bold",
        color:"rgb(31, 20, 182)"
    },
    navLinks: {
        display: "flex",
        gap: "15px",
    },
    link: {
        textDecoration: "none",
    },

};

export default NavBar;
