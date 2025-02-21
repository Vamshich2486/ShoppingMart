import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
    addToFavorites,
    removeFromFavorites,
    setFavorites,
} from "../../redux/features/favourites/favoriteSlice"
import {
    addFavoritesToLocalStorage,
    getFavoritesFromLocalStorage,
    removeFavoritesFromLocalStorage,
} from "../../Utils/localStorage"

const HeartIcon = ( {product} ) => {
    const dispatch = useDispatch();
    const favorites = useSelector(state=>state.favorites) || []
    const isFavorite = favorites.some((p) => p._id === product._id)

    useEffect(()=>{
        const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
        dispatch(setFavorites(favoritesFromLocalStorage));
    },[]);

    const toggleFavorites = () =>{
        if(isFavorite){
            dispatch(removeFromFavorites(product));
            //remove the product from local storage as well
            removeFavoritesFromLocalStorage(product._id);
        }else{
            dispatch(addToFavorites(product));
            //add the product to local storage as well
            addFavoritesToLocalStorage(product);
        }
    };

  return (
    <div onClick={toggleFavorites} className="absolute top-2 right-5 cursor-pointer">
        {isFavorite ? (<FaHeart className="text-pink-500" />):(
            <FaRegHeart />
        )}
    </div>
  )
}

export default HeartIcon