"use client"
import 'aos/dist/aos.css';
import AOS from "aos";
import Image from "next/image";
import logo from "../../public/images/logo.jpeg"
import { useEffect,useState } from "react";

export default function Home() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [firstVisible, setFirstVisible] = useState(false);
  const [secondVisible, setSecondVisible] = useState(false);
  const [page,setPage] =useState(0);
  const [articles,setArticles]=useState('');
  const [fetched,setfeteched]=useState(false);

  const handleScroll = () => {
    // Check if the scroll position is at the top
    const currentScrollY = window.scrollY;
    setIsAtTop(currentScrollY === 0);
  };
  useEffect(() => {
      const firstTimer = setTimeout(() => {
          setFirstVisible(true);
      }, 100); // Delay for the first text

      const secondTimer = setTimeout(() => {
          setSecondVisible(true);
      }, 100); // Delay for the second text

      
  }, []);
  useEffect(() => {
      // Add scroll event listener
      window.addEventListener('scroll', handleScroll);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  useEffect(() => {
    AOS.init({once: true});
  }, []);
  async function fetchData(category="general") {
    console.log(category);
    const currentDate = new Date();
    let data=localStorage.getItem(`top-headlines-${category}`);
    data=JSON.parse(data);
    // console.log(data.hour);
    // console.log(data.date);
    // console.log(data.data);
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    if(data && data.hour===hours && data.date===day){
      setfeteched(true);
      setArticles(data.data);
      console.log(articles);
      return;
    }
    console.log("after if")
    fetch(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=5526c8296043fd649b7112e4421a0db7`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const articles = data.articles;
      if(articles){
        console.log(articles);
        const currentDate = new Date();// Add 1 since months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const formattedDateTime = `${day}-${hours}`;
        console.log(formattedDateTime);
        // Find the middle index
        const middleIndex = Math.floor(articles.length / 2);

        // Split the array into two halves
        const firstHalf = articles.slice(0, middleIndex);
        const secondHalf = articles.slice(middleIndex);
        const matArt=[firstHalf,secondHalf]
        const val={
          "data":matArt,
          "hour":hours,
          "date":day
        }
        const formattedval= JSON.stringify(val)
        localStorage.setItem(`top-headlines-${category}`,formattedval);
        setArticles(matArt);
        setfeteched(true);
      }
      else{
        console.log("No articles found");
      }
    })
    .catch((error)=>{
      console.error('Error fetching data:', error);
    // Handle the error as needed, e.g., show an error message to the user
    setError(error.message);
    });
  }
  async function fetchSearch() {
    const q=document.getElementById("q").value;
    const apikey="5526c8296043fd649b7112e4421a0db7"
    const url = `https://gnews.io/api/v4/search?q=${q}&lang=en&country=us&max=10&apikey=` + apikey;

    fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const articles = data.articles;
      if (articles) {
        console.log(articles)
        const middleIndex = Math.floor(articles.length / 2);

        // Split the array into two halves
        const firstHalf = articles.slice(0, middleIndex);
        const secondHalf = articles.slice(middleIndex);
        const matArt=[firstHalf,secondHalf];
        setArticles(matArt);
        setfeteched(true);
      }else{
        console.log("No articles found")
      }
      
    });
  }
  useEffect(()=>{
    
    fetchData();
    
  },[])
  function handleCat() {
    const category= document.getElementById("category").value
    console.log(category);
    fetchData(category);
  }
return(
  <main className='h-auto'>
      <nav className={`  bg-white fixed   z-10 transform w-screen -translate-y-1/2 p-4 shadow-md transition-transform duration-700 ease-in-out ${firstVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0' }`}>
        <div  className={`flex items-center justify-between`}> 

          <ul className="flex p-5 text-center ">
            <a href="/" className="p-2 text-xl font-sans font-bold flex hover:bg-slate-100 hover:rounded hover:bg-opacity-10">
              <Image src={logo} width={30} height={10} className='mx-3'/>
              ACONEWS
            </a>
          </ul>
          
          <ul className='flex'>
              <li  className="p-2 items-center text-xl font-sans font-semibold flex hover:bg-slate-100 hover:rounded hover:bg-opacity-10">
                
                
                <input type="text" id="q" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " placeholder="search"></input>
                <div onClick={fetchSearch}>
                  <svg className="mx-2 w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
              </li>
          </ul>
        </div>
      </nav>
      <div data-aos="fade-up" className="absolute top-1/4">
          
          <div className=' lg:left-10   lg:mx-44 w-fit'>
            <div className='flex justify-between items-center align-middle'>
              <h1  className='text-4xl font-semibold py-2'>Top headlines</h1>
              <form className="max-w-sm flex">
                    <select  id="category" className="mx-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                      <option defaultValue value="general">general</option>
                      <option value="world">world</option>
                      <option value="nation">nation</option>
                      <option value="business">business</option>
                      <option value="technology">technology</option>
                      <option value="entertainment">entertainment</option>
                      <option value="sports">sports</option>
                      <option value="science">science</option>
                      <option value="health">health</option>
                      
                    </select>
                    <button onClick={handleCat} type="button" className="p-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
              </form>
            </div>
            <div className='flex min-h-auto my-3 justify-center m-4'>
                {
                  (fetched == true)?
                    <div className='lg:flex lg:h-fit lg:hover:bg-slate-100 lg:hover:border-2 lg:p-2 lg:rounded hover:transition hover:ease-in-out hover:duration-500 '>
                      <div className='lg:w-[40%] lg:h-fit'>
                        <h1 className='text-3xl font-bold py-3 line-clamp-2'>{articles[page][0]["title"]}</h1>
                        <p className='text-slate-800'>
                        {articles[page][0]["description"]}
                        </p>
                        <br></br>
                        <a className='py-2' href={articles[page][0]["url"]}>learn more</a>
                      </div>
                      <div className='flex justify-center   h-fit '>
                        <img className='h-[100%] w-[100%] px-2' width={450}  src={articles[page][0]["image"]}></img>
                      </div>
                    </div>:<div></div>
                  }
              
            </div>
            <div>
              <h3 className='text-2xl font-semibold'>More headlines</h3>
            </div>
            <div data-aos="fade-up" className="min-h-screen ">
                {
                  (fetched==true)? 
                    articles[page].slice(1).map((item, index) => (
                      // <li key={index} className='text-black'>{item["title"]}</li>
                      <div className='lg:flex m-4 hover:bg-slate-100 hover:border-2 p-2 rounded' data-aos="fade-up" key={index} >
                        <div className='lg:w-[40%] sm:w-screen '>
                          <img src={item["image"]} height={300} width={300} className='"w-full h-full object-cover sm:flex sm:justify-center'/>
                        </div>
                        <div className='lg:w-[60%] sm:w-screen'>
                          <h1 className='line-clamp-2 text-2xl px-3 font-semibold'>{item["title"]}</h1>
                          <p className='px-3 text-slate-600'>
                          {item["description"]}
                          <br></br>
                            <a href={item["url"]}>  learn more</a>
                          </p>
                          <a href={item["source"]["url"]} className='p-2'>Source: {item["source"]["name"]}</a>
                        </div>
                      </div>
                    )):<div></div>
                  }
                
            </div>
            <div>
              <nav aria-label="Page navigation example" className='m-3 flex justify-center'>
                <ul class="inline-flex -space-x-px text-sm ">
                  <li>
                    <a onClick={() => setPage(0)} href="#" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">Previous</a>
                  </li>
                  <li>
                    <a onClick={() => setPage(0)} href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">1</a>
                  </li>
                  <li>
                    <a onClick={() => setPage(1)} href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">2</a>
                  
                  </li>
                  <li>
                    <a onClick={() => setPage(1)} href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className='absolute top-[100%] bg-slate-200 w-screen  p-3'>
            <h3> <span className='font-semibold'>powered by</span> : GNews</h3>
          </div>
      </div>
      
  </main>
    
);
}
