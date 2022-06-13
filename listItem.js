var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = 'https://api.tvmaze.com/shows';
const moviesGrid = document.querySelector(".movies-grid");
const input = document.querySelector("input");
const form = document.querySelector(".search-div");
//Fetching api
const fetchData = (urlApi) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        moviesGrid.innerHTML = `<h1>Loading...</h1>`;
        const resolve = yield fetch(urlApi);
        const data = yield resolve.json();
        return data;
    }
    catch (error) {
        alert(error);
    }
    ;
});
//Pagination
const pagination = (data) => {
    const itemsPerPage = 45;
    const numberOdPages = Math.ceil(data.length / itemsPerPage);
    const newMovies = Array.from({ length: numberOdPages }, (_, index) => {
        const start = index * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    });
    return newMovies;
};
//Pagination btns
const btnsDiv = document.querySelector('.pagintation-div');
let index = 0;
let pages = [];
//Rendering movies
const titleList = document.querySelector(".all-movies-title");
const filterBox = document.querySelector(".category-list");
const displayMovies = () => __awaiter(void 0, void 0, void 0, function* () {
    btnsDiv.innerHTML = '';
    const data = yield fetchData(url);
    //Filters
    const allArr = data.map((movie) => movie.genres);
    const dataFilter = ['All', ...new Set(allArr.reduce((merged, arr) => merged.concat(arr)))];
    dataFilter.forEach(category => {
        filterBox.innerHTML += `<div class="cat-btn">${category}</div>`;
    });
    const cateBtns = document.querySelectorAll(".cat-btn");
    cateBtns.forEach(btn => {
        if (btn.innerHTML === 'All') {
            btn.classList.add("cat-btn-active");
        }
        ;
        btn.addEventListener('click', () => {
            index = 0;
            btnsDiv.innerHTML = '';
            cateBtns.forEach(btn => btn.classList.remove("cat-btn-active"));
            btn.classList.add("cat-btn-active");
            if (btn.innerHTML === 'All') {
                titleList.innerHTML = "All movies and serials";
                displayPagination(data);
                renderMovies();
            }
            else {
                const newArr = data.filter((movie) => {
                    if (movie.genres.includes(btn.innerHTML)) {
                        return movie;
                    }
                    ;
                });
                titleList.innerHTML = btn.innerHTML;
                displayPagination(newArr);
                renderMovies();
            }
        });
    });
    //Rendering pagination
    function displayPagination(arr) {
        pages = pagination(arr);
        pages.map((_, pageIndex) => {
            return btnsDiv.innerHTML += ` <div class="page">${pageIndex + 1}</div>`;
        }).join('');
        const btnsPag = document.querySelectorAll(".page");
        if (btnsPag.length === 1) {
            btnsDiv.style.display = "none";
        }
        else {
            btnsDiv.style.display = "flex";
        }
        btnsPag.forEach(number => {
            if (+number.innerHTML == index + 1) {
                number.classList.add("page-active");
            }
            ;
            number.addEventListener('click', () => {
                index = +number.innerHTML - 1;
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                renderMovies();
                btnsPag.forEach(btns => { btns.classList.remove("page-active"); });
                number.classList.add("page-active");
            });
        });
    }
    ;
    //Rendering movies
    displayPagination(data);
    function renderMovies() {
        const newPage = pages[index];
        input.value = '';
        const list = newPage.map((movie) => {
            const { premiered, name } = movie;
            const img = movie.image.medium;
            const movieItem = `<div class="grid-item">
                                    <a href="${movie.url}"></a>
                                    <img src="${img}" alt="">
                                    <h2>${name}</h2>
                                    <p>${premiered}</p>
                                </div>`;
            return movieItem;
        }).join('');
        moviesGrid.innerHTML = `${list}`;
    }
    ;
    renderMovies();
});
//Search 
form.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (input.value === "") {
        titleList.innerHTML = "All movies and serials";
        displayMovies();
    }
    else {
        const displaySearch = () => __awaiter(void 0, void 0, void 0, function* () {
            filterBox.innerHTML = '';
            titleList.innerHTML = "Your Results";
            btnsDiv.innerHTML = '';
            const data = yield fetchData(`https://api.tvmaze.com/search/shows?q=${input.value}`);
            const newData = data.filter((movie) => movie.image !== null);
            const list = newData.map((movie) => {
                const { id, premiered, name } = movie;
                const img = movie.image.medium;
                const movieItem = `<div class="grid-item">
                                        <a href="./singleItem.html?id=${id}"></a>
                                        <img src="${img}" alt="">
                                        <h2>${name}</h2>
                                        <p>${premiered}</p>
                                    </div>`;
                return movieItem;
            }).join('');
            moviesGrid.innerHTML = `${list}`;
        });
        displaySearch();
    }
    ;
});
displayMovies();
export {};
