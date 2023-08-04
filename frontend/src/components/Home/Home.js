import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/all"
import "./Home.css"
import Product from "./ProductCard.js"
import MetaData from '../layout/MetaData'
import { getproduct } from '../../actions/productAction'
import {useSelector,useDispatch} from "react-redux"
import Loader from '../layout/loader/Loader.js'
import {useAlert} from "react-alert"




const Home = () => {
    const alert=useAlert()
    const dispatch=useDispatch();
    const {loading,error,products,productsCount} = useSelector(
        (state)=>state.products
    )



    useEffect(()=>{
        if(error){
            return alert.error(error)
        }
        dispatch(getproduct()); 
    },[dispatch,error,alert])



  return (
    <Fragment>
        {loading ? <Loader />: (
        <Fragment>
        <MetaData title="Home working" />

        <div className='banner'>
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCT BELOW</h1>

            <a href='#container'>
                <button>
                    Scroll <CgMouse />
                </button>
            </a>
        </div>
        <h2 className='homeHeading'>Featured Products</h2>

        <div className='container' id='container'>
            {products && products.map((product)=> <Product product={product} />)}
        </div>

    </Fragment>
        )}
    </Fragment>
  )
}

export default Home