import { useEffect} from 'react';
import { fetchDataFromApi } from './utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { getApiConfiguration } from './store/homeSlice';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Header from './components/header/Header';
import Footer from './components/footer/Footer.';
import Details from './pages/details/Details';
import SearchResult from './pages/searchResult/SearchResult';
import Explore from './pages/explore/Explore';
import PageNotFound from './pages/404/404';
import { getGenres } from './store/homeSlice';


function App() {
  const dispatch = useDispatch();
  const {url}= useSelector((state)=> state.home);
  console.log(url);

  useEffect(()=>{
    fetchApiConfig();
    generesCall();
  }, []);

  const fetchApiConfig = ()=>{
    fetchDataFromApi('/configuration')
    .then((res) =>{
      console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    });
  };

  const generesCall = async () =>{
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url)=>{
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    data.map(({genres})=>{
      return genres.map((item)=>(allGenres[item.id]= item))
    });

    dispatch(getGenres(allGenres));

  };

  return (
    <>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/:mediaType/:id' element={<Details/>}/>
            <Route path='/search/:query' element={<SearchResult/>}/>
            <Route path='/explore/:mediaType' element={<Explore/>}/>
            <Route path='*' element={<PageNotFound/>}/>
          </Routes>
          <Footer/>
        </BrowserRouter>
    </>
  )
}

export default App;
