import { useEffect, useState } from 'react'
import Search from './components/search'
import Spinner from './components/spinner'
import MovieCard from './components/MovieCard';
import Footer from './components/footer';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY= 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDhmYjhiYTNmY2Q3OTU3MjA1YThmNjAwYzA4ZGVlYyIsIm5iZiI6MTc0MTYxODA3MC45MTM5OTk4LCJzdWIiOiI2N2NlZmI5NjUzMjgyYzlkZTYyYTdmM2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.OWvV5ELPuCFQMrIisjepYc9OXXUuOhZ0sZHLHA2mnew';

const API_OPTIONS = {
  method: 'GET',
  headers: {
     'accept': 'application/json',
     'Authorization': `Bearer ${API_KEY}`
  }
}
function App() {
const[searchTerm, setsearchTerm] = useState('');
const[erroMessage, setErrorMessage] = useState('');
const[moviesList, setMoviesList] = useState([]);
const[isLoading, setIsLoading] = useState(false);
const [dedouncedSearchTerm, setDedouncedSearchTerm] = useState('');
const [trendingMovies, settrendingMovies] = useState([]);
useDebounce(()=>setDedouncedSearchTerm(searchTerm), 100, [searchTerm]);

const fetchMovies = async (query = '') => {
  setIsLoading(true);
  setErrorMessage('');
  try{
    const end_point = query?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(end_point, API_OPTIONS);
    
    if(!response.ok){
      throw new Error('fetching movies failed');
    }
    const data = await response.json();
    console.log(data);
    if(data.Resposne==='False'){
      setErrorMessage(data.Error || 'Failed fetching movies');
      setMoviesList([]);
      return;
    }
  
    setMoviesList(data.results || []);
    if(query && data.results.length>0 ){
      await updateSearchCount(query, data.results[0]);
    }
  }

  catch(error){
  console.error(`data fetching error: ${error}`);
  setErrorMessage("error fetching movies please try again later");
  } finally{
    setIsLoading(false);}

  }
  

 const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

useEffect(() => { 
  loadTrendingMovies()

}, [])


useEffect(() => {

  fetchMovies(dedouncedSearchTerm);
} , [dedouncedSearchTerm]);




  return (
    <>
  <main>
  
<div className='pattern'/>
<div className='relative flex justify-center pt-10'> 

<img  className='w-72 h-72' src="./ks-logo.png" alt="" srcset="" />
</div>

<div className="wrapper">
  <header>
    <img src="./hero.png" alt="" srcset="" />
    <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassle</h1>
<Search searchTerm={searchTerm} setsearchTerm={setsearchTerm}/>
  </header>

  {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
 


<section className='all-movies'>

<h2 >All Movies</h2>

  
  {isLoading ? (<div className='flex justify-center '><Spinner/></div>):erroMessage?(<p className='text-red-500'>{erroMessage}</p>):(<ul>

{moviesList.map((movie)=>(
<MovieCard key={movie.id} movie={movie}/>


))}

  </ul>)}
 
</section>
</div>
<Footer/>
 </main>
    </>
  )
}

export default App;
