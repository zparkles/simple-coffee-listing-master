import {useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom/client';

interface Coffee {
    id: string,
    name: string,
    image: string,
    price: string,
    rating: string,
    votes: number,
    popular: boolean,
    available: boolean

}

function Card({ coffee }: { coffee: Coffee }){

    
        return(
                <div>
                    <div className = "custom-row card" id = {coffee.id}>
                        {coffee.popular ? (
                             <button type="button" className="btn btn-sm btn-warning position-absolute top-0 start-0 m-2">Popular</button>
                            
                        ) : (
                            <div></div>
                        )}
                        <img className="card-img-top" src={`${coffee.image}`} />
                        <div className = "card-body">
                            <div className = "row">
                                <div className = "col-8">
                                     <h5 className="card-title">{coffee.name}</h5>
                                     {coffee.rating === null ? (
                                        <p className="card-text no-rating"><img src="/resources/Star.svg"/>No ratings</p>
                                     ): (
                                        <p className="card-text"><img src="/resources/Star_fill.svg"/>{coffee.rating} <span>({coffee.votes} votes)</span></p>
                                     )}  
                                </div>
                                <div className = "col-4 price-availability">
                                    <button type="button" className="btn btn-sm btn-info">{coffee.price}</button>
                                    {!coffee.available ? (
                                        <p className="card-text sold-out">Sold out</p>
                                    ):(
                                       <p></p> 
                                    )}
                                    
                                    
                                </div>
                            </div>
                           
                        </div>

                    </div>
                </div>
            )
    
    
}

function App () {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [coffeeData, setCoffeeData] = useState<Coffee[]>([]); 
    const[view, setView] = useState(true);
    
    // to cancel pending request when making a new one
    const abortController = useRef<AbortController | null>(null);

    useEffect(()=> {
        const fetchData = async()=> {

            abortController.current?.abort()
            abortController.current = new AbortController()
            setIsLoading(true)
            try{
            const response = await fetch('https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json', 
                {signal: abortController.current?.signal})
            const responseData = (await response.json()) as Coffee[]
            setCoffeeData(responseData)
            } catch(e:any) {
                if(e.name === "AbortError"){ //?? idk where the value is from
                    console.log("Aborted")
                    return
                }
                setError(e)
            }
            finally{
              setIsLoading(false)  
            }
           
        }

        fetchData();
    }, [view]) 

    /*if (isLoading){
        return <div>Loading...</div>
    }*/

    if (error){
        alert("Something went wrong!")
    }

    

    return (
        <div>
            <img src="/resources/bg-cafe.jpg" className="cafe-img"/>
            <div className="container">
                
                <h2 className="collection-title">Our Collection</h2>
                <p className="description">Introducing our Coffee Collection, a selection of unique coffees from different roast types and origins, expertly roasted in small batches and shipped fresh weekly.</p>
                <img src="/resources/vector.svg" className="vector position-absolute top-0 start-50 m-2"/>
                <div className="buttons">
                    <button type="button" className={view ? 'btn btn-sm btn-availability btn-secondary': 'btn btn-sm btn-availability btn-dark'} onClick={()=> setView(true)}>All Products</button>
                    <button type="button" className={!view ? 'btn btn-sm btn-availability btn-secondary': 'btn btn-sm btn-availability btn-dark'} onClick={()=> setView(false)}>Available Products</button>
                </div>
                <div className="row g-1">
                {view ? (
                    coffeeData.map((c)=>(
                        <div className = "col-4">
                        <Card key ={c.id} coffee={c}/>
                        </div>
                        
                    ))
                ): (
                    coffeeData.filter((c) => c.available)
                    .map((c)=>(
                        <div className = "col-4">
                        <Card key ={c.id} coffee={c}/>
                        </div>   
                        
                    ))

                )}
                    
                </div>
            </div>
        
        </div>
    )
            }

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);            