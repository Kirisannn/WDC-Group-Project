/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const SPORTS_CLUBS = [{
  name: 'Basketball Club',
  url: 'basketball.html'
}, {
  name: 'Cricket Club',
  url: 'cricket.html'
},
{
  name: 'Football Society',
  url: 'football.html'
}];

const ARTS_CLUBS = [{
  name: 'Dance',
  url: 'dance.html'
}, {
  name: 'Music Club',
  url: 'music.html'
},
{
  name: 'Painting',
  url: 'painting.html'
}];

const FACULTY_CLUBS = [
  {
    name: 'Computer Science Club',
    url: 'compsciclub.html'
  }, {
    name: 'English Club',
    url: 'englishclub.html'
  },
  {
    name: 'Maths Society',
    url: 'mathsclub.html'
  }];

const CULTURE_CLUBS = [{
  name: 'Anime',
  url: 'anime.html'
},
{
  name: 'Comics',
  url: 'comics.html'
}, {
  name: 'Kpop',
  url: 'kpop.html'
}];



const clubs = new Vue({
  el: '#vue_clubs',
  data: {
    sports_clubs: SPORTS_CLUBS,
    arts_clubs: ARTS_CLUBS,
    faculty_clubs: FACULTY_CLUBS,
    culture_clubs: CULTURE_CLUBS,
    searchQuery: ''
  }
});
