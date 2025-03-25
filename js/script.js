//page product

const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

"use strict"
const images = [
	{'id' : '1', 'url':'./img/slide/img1.jpg'},
	{'id' : '2', 'url':'./img/slide/img2.jpg'},
	{'id' : '3', 'url':'./img/slide/img3.jpg'},
    {'id' : '4', 'url':'./img/slide/img4.jpg'},
];

const containerItems = document.querySelector("#container-items");
const loadImages =(images)=>{
	images.forEach(image =>{
		containerItems.innerHTML += `
			<div class='item'>
				<img src='${image.url}'>
			</div>
		`
	})
}


loadImages(images, containerItems);

let items = document.querySelectorAll(".item");

const previous = () =>{
	containerItems.appendChild(items[0]);
	items = document.querySelectorAll(".item");
}
const next = () =>{
	const lastItem = items[items.length - 1];
	containerItems.insertBefore(lastItem, items[0]);
	items = document.querySelectorAll(".item");
}

document.querySelector("#previous").addEventListener("click", previous)
document.querySelector("#next").addEventListener("click", next)


let autoPlayInterval;

const startAutoPlay = () =>{
    autoPlayInterval = setInterval(() =>{
        next();
    }, 4000);
};

const stopAutoPlay = () =>{
    clearInterval(autoPlayInterval);
};

startAutoPlay();

// Seleciona todos os elementos que podem interferir com o hover (incluindo o container-shadow)

const interactiveElements = [containerItems, ...document.querySelectorAll('.container-shadow, .item, .item img')];


interactiveElements.forEach(element => {
    element.addEventListener("mouseenter", stopAutoPlay);
    element.addEventListener("mouseleave", startAutoPlay);
});

containerItems.addEventListener("mouseover", stopAutoPlay);
containerItems.addEventListener("mouseout", startAutoPlay);





// SILDER EQUIPE

const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Obtenha o número de cartões que cabem no carrossel de uma só vez
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insira cópias dos últimos cartões no início do carrossel para rolagem infinita

carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insira cópias dos primeiros cartões no final do carrossel para rolagem infinita
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Role o carrossel na posição apropriada para ocultar os primeiros cartões duplicados no Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Adicione ouvintes de evento para os botões de seta para rolar o carrossel para a esquerda e para a direita
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Registra o cursor inicial e a posição de rolagem do carrossel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false retorne daqui
    // Atualiza a posição de rolagem do carrossel com base no movimento do cursor
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // Se o carrossel estiver no começo, role até o final
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // Se o carrossel estiver no final, role até o início
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Limpe o tempo limite existente e inicie a reprodução automática se o mouse não estiver pairando sobre o carrossel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Retorne se a janela for menor que 800 ou isAutoPlay for false
    // Reprodução automática do carrossel a cada 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

