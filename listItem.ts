import {ApiData}  from "./ApiData";

interface ApiSearch {
    show: ApiData
}

interface ApiDataArr extends Array<ApiData>{}

const url = 'https://api.tvmaze.com/shows';
const moviesGrid = document.querySelector(".movies-grid") as HTMLDivElement;
const input = document.querySelector("input") as HTMLInputElement;
const form = document.querySelector(".search-div") as HTMLFormElement;

//Fetching api

const fetchData = async (urlApi: string, additionalText?: string)=>{
    try {
        
        moviesGrid.innerHTML =`<h1 style="position: absolute" >${additionalText}<br> Loading...</h1>`;
        const resolve = await fetch(urlApi);
        const data = await resolve.json();
        return data;

    } catch (error) {

        alert(error);

    };
};

//Pagination

const pagination = (data: ApiDataArr)=>{

    const itemsPerPage = 45;
    const numberOdPages = Math.ceil(data.length / itemsPerPage);
    const newMovies = Array.from({length:numberOdPages},(_,index)=>{
        const start = index * itemsPerPage;
        return data.slice(start,start + itemsPerPage);
    });
    return newMovies
};

//Pagination btns

const btnsDiv = document.querySelector('.pagintation-div') as HTMLDivElement;

let index: number = 0;
let pages: ApiDataArr[] = [];

//Rendering movies

const titleList = document.querySelector(".all-movies-title") as HTMLDivElement;
const filterBox = document.querySelector(".category-list") as HTMLDivElement;

const displayMovies = async ()=>{

    btnsDiv.innerHTML =''

    const data = await fetchData(url);

    //Filters

    const allArr =  data.map((movie: ApiData) =>movie.genres);
    const dataFilter = ['All',...new Set (allArr.reduce((merged: string[],arr: string[])=> merged.concat(arr)))];
    
    dataFilter.forEach(category=>{

        filterBox.innerHTML +=`<div class="cat-btn">${category}</div>`

    });

    const cateBtns = document.querySelectorAll(".cat-btn");

    cateBtns.forEach(btn=>{

        if(btn.innerHTML === 'All'){

            btn.classList.add("cat-btn-active");

        };

        btn.addEventListener('click',()=>{

            index = 0

            btnsDiv.innerHTML = '';
            
            cateBtns.forEach(btn=>btn.classList.remove("cat-btn-active"));

            btn.classList.add("cat-btn-active");

            if(btn.innerHTML === 'All'){

                titleList.innerHTML = "All movies and serials";

                displayPagination(data);
                renderMovies();
                
            }else{

                const newArr = data.filter((movie: ApiData)=>{        

                    if(movie.genres.includes(btn.innerHTML)){
    
                        return movie
    
                    };
    
                });

                titleList.innerHTML = btn.innerHTML;
    
                displayPagination(newArr);
                renderMovies();

            }
            
        });

    });

    //Rendering pagination

    function displayPagination(arr: ApiDataArr){

        pages = pagination(arr);

        pages.map((_,pageIndex)=>{
            return btnsDiv.innerHTML += ` <div class="page">${pageIndex + 1}</div>`
        }).join('');

        const btnsPag = document.querySelectorAll(".page");

        if(btnsPag.length===1){
            btnsDiv.style.display="none"
        }else{
            btnsDiv.style.display="flex"
        }

        btnsPag.forEach(number=>{

            if(+number.innerHTML == index + 1){
                number.classList.add("page-active");
            };

            number.addEventListener('click',()=>{

                index = +number.innerHTML - 1
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                renderMovies();

                btnsPag.forEach(btns=>{btns.classList.remove("page-active")});
                
                number.classList.add("page-active");

            });

        });
    };

    //Rendering movies

    displayPagination(data);

    function renderMovies (){

        const newPage = pages[index];       

        input.value='';

        const list = newPage.map((movie: ApiData)=>{

            const {premiered,name,url} = movie;
            const img = movie.image.medium;           

            return  `<div class="grid-item">
                        <a href="${url}"></a>
                        <img src="${img}" alt="">
                        <h2>${name}</h2>
                        <p>${premiered}</p>
                    </div>`;

        }).join('');
        moviesGrid.innerHTML = `${list}`;
    };

    renderMovies();
};

//Search 

form.addEventListener('keyup', (e)=>{

    e.preventDefault();

    if(input.value === ""){

        titleList.innerHTML = "All movies and serials";

        displayMovies();

    }else{

        const displaySearch = async ()=>{

            filterBox.innerHTML = '';

            titleList.innerHTML = "Your Results";

            btnsDiv.innerHTML =''

            const data = await fetchData(`https://api.tvmaze.com/search/shows?q=${input.value}`,`Can't find try to write more`);

            const newData = data.filter((movie: ApiSearch)=>movie.show.image!==null);        

            const list = newData.map((movie: ApiSearch)=>{

                const {id,premiered,name} = movie.show;
                const img = movie.show.image.medium;                         
    
                return `<div class="grid-item">
                            <a href="./singleItem.html?id=${id}"></a>
                            <img src="${img}" alt="">
                            <h2>${name}</h2>
                            <p>${premiered}</p>
                        </div>`;

            }).join('');

            moviesGrid.innerHTML = `${list}`;

        };

        displaySearch();
    };

});

displayMovies();
