import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/all"
import "./Home.css"
import Product from "./Product.js"
import MetaData from '../layout/MetaData'
import { getproduct } from '../../actions/productAction'
import {useSelector,useDispatch} from "react-redux"
import Loader from '../layout/loader/Loader.js'
import {useAlert} from "react-alert"



// const product={
//     name:"Blue tshirt",
//   //  images:[{url:"data:image/jpeg;base64,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"}],
//     price:"$300",
//     _id:"aaaaa",
// }

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
    },[dispatch,error])



  return (
    <Fragment>
        {loading ? <Loader />: (
        <Fragment>
        {/* <MetaData title="Home working" /> */}

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