import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SignUp from '@/components/User/SignUp'
import SignIn from '@/components/User/SignIn'
import BooksToRead from '@/components/Books/BooksIWantToRead'
import BooksAlreadyRead from '@/components/Books/BooksIHaveRead'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: SignUp
    },
    {
      path: '/signin',
      name: 'Sign In',
      component: SignIn
    },
    {
      path: '/bookstoread',
      name: 'BooksToRead',
      component: BooksToRead
    },
    {
      path: '/booksihaveread',
      name: 'BooksAlreadyRead',
      component: BooksAlreadyRead
    }
  ],
  mode: 'history'
})
