import React, { useState } from "react";
import "./InputSearch.css";
import Shimmer from "./Shimmer";

const InputSearch = () => {
  const [itemList, setItemList] = useState([]);
  const [updatedList, setUpdatedList] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [sortItem, setSortItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (searchItem) => {
    setIsLoading(true);
    const data = await fetch(
      `https://api.github.com/search/repositories?q=${searchItem}`
    );
    const json = await data.json();

    setItemList(json?.items);
    setUpdatedList(json?.items);
    console.log(json);
    setIsLoading(false);
  };

  const ellipsisCreator = (str) => {
    if (str?.length === undefined || str === "undefined") {
      return "";
    }

    return str?.length < 25 ? str.length : `${str?.substr(0, 25)}...`;
  };

  // For Sorting

  const sortFilter = (e) => {
    const filteredArr = updatedList.sort((a, b) => {
      if (e.target.value === "stars") {
        return a.stargazers_count - b.stargazers_count;
      } else if (e.target.value === "score") {
        return a.score - b.score;
      } else if (e.target.value === "name") {
        return a.name.localeCompare(b.name);
      } else if (e.target.value === "created_at") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (e.target.value === "updated_at") {
        return new Date(b.updated_at) - new Date(a.updated_at);
      } else if (e.target.value === "watchers") {
        return a.watchers_count - b.watchers_count;
      }
    });
    setSortItem(e.target.value);
    setUpdatedList(filteredArr);
  };
  return (
    <>
      <div className="div_inp_btn">
        <div>
          <img
            className="logo"
            src="https://dice.tech/static/media/logo.3856741b5559af1c7626.png"
          />
        </div>
        <div>
          <input
            className="input_box"
            placeholder="SEARCH"
            type="text"
            onChange={(e) => setSearchItem(e.target.value)}
            value={searchItem}
          />
          <button
            className="inp_btn"
            onClick={() => {
              fetchData(searchItem);
            }}
          >
            SEARCH
          </button>
        </div>
        <div>
          <span className="sorting">SORTING</span>
          <select
            value={sortItem}
            onChange={sortFilter}
            className="sorting_box"
          >
            <option value="" disabled>
              Please select
            </option>
            <option value="stars">Stars</option>
            <option value="watchers">Watchers Count</option>
            <option value="score">Score</option>
            <option value="name">Name</option>
            <option value="created_at">Created At</option>
            <option value="updated_at">Updated At</option>
          </select>
        </div>
      </div>

      <div className="main_prod_sect">
        {isLoading ? (
          <Shimmer />
        ) : (
          updatedList.map((product) => {
            console.log(product, "====== test");

            return (
              <div className="filterInput">
                <img className="mainImages" src={product?.owner.avatar_url} />
                <div className="text_content">
                  <h1 className="name">{product?.name?.slice(0, 25)}</h1>
                  <h2 className="star">{product?.stargazers_count}</h2>
                  <h3 className="description">
                    {ellipsisCreator(product?.description) || "No Description"}
                  </h3>
                  <h3 className="language">
                    {product?.language || "No Language"}
                  </h3>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
export default InputSearch;
