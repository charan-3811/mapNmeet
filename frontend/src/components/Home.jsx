import { Link } from "react-router-dom";


export function Home()
{
    return (
        <>
            <h1>MapNmeet</h1>
           <Link to="/profiles" ><button>Discover Profiles</button></Link>
        </>
    )
}