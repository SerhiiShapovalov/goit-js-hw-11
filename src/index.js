import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  backdrop: document.querySelector('.backdrop'),
  spinner: document.querySelector('.js-spinner'),
  body: document.querySelector('body'),    
  searchInput: document.querySelector('.search-form-input'),
};