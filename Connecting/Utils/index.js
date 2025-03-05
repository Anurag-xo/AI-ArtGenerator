import React, { useState } from "react";
import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true,
});

function extractImageUrls(imageArray) {
  return imageArray.map((image) => imgae.url);
}

export const REGISTER_USER = async (signUp) => {
  const { name, email, password, confirmPassword } = signUp;

  if (!name || !email || !password || !confirmPassword)
    return "Data is missing";

  if (password != confirmPassword) return "Password is not matching";

  const response = await axios({
    method: "POST",
    url: "/api/auth/register",
    withCredentials: true,
    data: {
      username: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    },
  });

  if ((response.status = 200)) {
    window.location.herf = "/";
  }
};

export const LOGIN_USER = async (login) => {
  const { email, password } = login;

  if (!email || !password || !confirmPassword) return "Data is missing";

  const response = await axios({
    method: "GET", //here was psot i changed it to get
    url: "/api/auth/login",
    withCredentials: true,
    data: {
      email: email,
      password: password,
    },
  });

  if (response.status == 200) {
    window.location.herf = "/";
  }
};

export const LOGOUT = async () => {
  const response = await axios({
    method: "GET",
    url: "/api/auth/logout",
    withCredentials: true,
    },
  });

  if (response.status == 200) {
    window.location.herf = "/";
  }
};

export const CHECK_AUTH = async () => {
  const response = await axios({
    method: "GET",
    url: "/api/auth/refetch",
    withCredentials: true,
  });

  let user;

  if (response.status == 200) {
    user = response.data;
  }
  return user;
};

export const LIKE_POST = async (postID) => {
  const currentUser = await CHECK_AUTH();

  const response = await axios({
    method: "POST",
    url: `/api/post/like/${postID}`,
    withCredentials: true,
    data: {
      userId: currentUser._id,
    },
  });

  if (response.status == 200) {
    return response;
  }
};

export const DISLIKE_POST = async (postID) => {
  const currentUser = await CHECK_AUTH();

  const response = await axios({
    method: "POST",
    url: `/api/post/dislike/${postID}`,
    withCredentials: true,
    data: {
      userId: currentUser._id,
    },
  });

  if (response.status == 200) {
    return response;
  }
};

export const IMAGE_GENERATOR_V3 = async (promptv3) => {
  const currentUser = await CHECK_AUTH();

  const { prompt, negativePrompt, size, style } = promptv3;

  if (!prompt || !negativePrompt || !size || !style) {
    return "Data is Missing";
  }

  const LOWERCASE = style.toLowerCase();

  const AIImage = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: size,
    quality: "hd",
    n: 1,
    style: LOWERCASE;
  });

  if(AIImage.data[0].url){
  const response = await axios({
    method: "POST",
    url: `/api/post/create/v3/${currentUser._id}`,
    withCredentials: true,
    data: {
        prompt,
        negativePrompt: negativePrompt,
        revisedPrompt: AIImage.data[0].revised_prompt,
        size,
        style,
        imageURL: AIImage.data[0].url,
    },
  });

  if (response.status == 200) {
    return response;
  }
};

