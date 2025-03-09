import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

// INTENAL IMPORT
import {
  HomeLogo,
  Search,
  Image,
  Filter,
  FaHeart,
  FaInstagram,
  AiOutlineYoutube,
  BsCameraReelsFill,
  FaRegHeart,
  Magic,
} from "../Components/SVG/index";

import {
  Header,
  GetStarted,
  ImageCard,
  SingleImage,
  ApertImageCard,
  Notic,
  Button,
  PaymentPossing,
} from "../Components/index";

import { GET_AI_IMAGES, CHECK_AUTH } from "../Utils/index";

const index = () => {
  const { query } = useRouter();

  const [openFilter, setOpenFilter] = useState(false);
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState("Reel");
  const [singleID, setSingleID] = useState();
  const [buying, setBuying] = useState();

  const [activeUser, setActiveUser] = useState();
  const [allAIImages, setAllAIImages] = useState();
  const [allPoatCopy, setAllPostCopy] = useState([]);

  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);

  //V3
  const [V3_1024x1024, setV3_1024x1024] = useState();
  const [V3_1792x1024, setV3_1792x1024] = useState();
  const [V3_1024x1792, setV3_1024x1792] = useState();

  //V2
  const [V2_256x256, setV2_256x256] = useState();
  const [V2_512x512, setV2_512x512] = useState();
  const [V2_1024x1024, setV2_1024x1024] = useState();

  useEffect(() => {
    if (query.CREDIT_PLAN) {
      setBuying(query.CREDIT_PLAN);
    }
  }, [query.CREDIT_PLAN]);

  const changeCategory = (categroy) => {
    const model = localStorage.getItem("ACTIVE_MODEL");

    if (model == "AI Image Art Dall-e-v2") {
      if (category == "Reel") {
        setAllAIImages(V3_1024x1792);
        setAllPostCopy(V3_1024x1792);
        setCategory("Reel");
      } else if (category == "Instagram") {
        setAllAIImages(V3_1024x1024);
        setAllPostCopy(V3_1024x1024);
        setCategory("Instagram");
      } else if (category == "Youtube") {
        setAllAIImages(V2_1024x1024);
        setAllPostCopy(V2_1024x1024);
        setCategory(V2_1024x1024);
      }
    } else {
      if (category == "Reel") {
        setAllAIImages(V3_1024x1792);
        setAllPostCopy(V3_1024x1792);
        setCategory("Reel");
      } else if (category == "Instagram") {
        setAllAIImages(V3_1024x1024);
        setAllPostCopy(V3_1024x1024);
        setCategory("Instagram");
      } else if (category == "Youtube") {
        setAllAIImages(V3_1792x1024);
        setAllPostCopy(V3_1792x1024);
        setCategory("Youtube");
      }
    }
  };

  const CALLING_ALL_POSTS = async () => {
    try {
      const response = await GET_AI_IMAGES();

      const V2_256x256Temp = [];
      const V2_512x512Temp = [];
      const V2_1024x1024Temp = [];

      const V3_1024x1024Temp = [];
      const V3_1792x1024Temp = [];
      const V3_1024x1792Temp = [];

      response.forEach((el) => {
        if (el.aiModel === "AI Image Art Dall-e-v2") {
          if (el.size === "256x256") {
            V2_256x256Temp.push(el);
          } else if (el.size === "512x512") {
            V2_512x512Temp.push(el);
          } else if (el.size === "1024x1024") {
            V2_1024x1024Temp.push(el);
          }
        } else if (el.aiModel === "AI Image Art Dall-e-V3") {
          if (el.size === "1024x1024") {
            V3_1024x1024Temp.push(el);
          } else if (el.size === "1792x1024") {
            V3_1024x1024Temp.push(el);
          } else if (el.size === "1024x1792") {
            V3_1024x1792Temp.push(el);
          }
        }
      });

      setV2_256x256(V2_256x256Temp);
      setV2_512x512(V2_512x512Temp);
      setV2_1024x1024(V2_1024x1024Temp);

      setV3_1024x1024(V3_1024x1024Temp);
      setV3_1792x1024(V3_1792x1024Temp);
      setV3_1024x1792(V3_1024x1792Temp);

      const model = localStorage.getItem("ACTIVE_MODEL");

      if (model === "AI Image Art Dall-e-v2") {
        setAllAIImages(V2_256x256Temp);
        setAllPostCopy(V2_256x256Temp);
      } else {
        setAllAIImages(V3_1024x1792Temp);
        setAllPostCopy(V3_1024x1792Temp);
      }

      const storedCookiedValue = Cookies.get("token");

      if (storedCookiedValue) {
        const user = await CHECK_AUTH();
        setActiveUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CALLING_ALL_POSTS();
  }, []);

  const onHandleSearch = (value) => {
    const filterPosts = allAIImages?.filter(({ promt }) =>
      prompt.toLowerCase().includes(value.toLowerCase()),
    );

    if (filterPosts.length === 0) {
      setAllAIImages(allPostCopy);
    } else {
      setAllAIImages(filterPosts);
    }
  };

  const onClearSearch = () => {
    if (allAIImages?.length && allPostCopy?.length) {
      setAllAIImages(allPostCopy);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if (search) {
      onHandleSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  const arrayRender = [...(allAIImages?.reverse() || [])];
  return <div>index</div>;
};

export default index;
