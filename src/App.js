import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [characters, setCharacters] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberPages, setTotalNumberPages] = useState(1);

  const getCharacters = async (currentPage) => {
    const resp = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${currentPage}`
    );
    const characters = await resp.data.results;
    console.log(characters);
    const totalPages = await resp.data.info.pages;
    setTotalNumberPages(totalPages);
    setCharacters(
      characters
        .map(({ id, name, status, species, gender, image, episode }) => ({
          id,
          name,
          status,
          species,
          gender,
          image,
          episode
        }))
        .filter((e) => e.status !== "unknown")
    );
  };

  useEffect(() => {
    getCharacters(currentPage);
  }, [currentPage]);

  return (
    <div className="App">
      <div className="card-content">
        {characters?.map(
          ({ image, name, episode, species, gender, status }, index) => (
            <div key={`${name}-${index++}`}>
              <CardCharacter
                img={image}
                name={name}
                episode={episode}
                species={species}
                gender={gender}
                status={status}
              />
            </div>
          )
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <Pagination
          currentPage={currentPage}
          totalNumberPages={totalNumberPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

const CardCharacter = ({ img, name, episode, species, gender, status }) => {
  return (
    <div className="card-item">
      <img src={img} alt={name} className="image" />
      <div className="info">
        <h3 style={{}}>{name}</h3>
        <h4>Gender: {gender}</h4>
        <span>Species: {species}</span>
        <span>Episodes: {getEnumerable(episode)}</span>
        <div className="status">{status}</div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalNumberPages, setCurrentPage }) => {
  return (
    <div className="pagination-content">
      <button
        onClick={() =>
          currentPage > 1 && setCurrentPage((currentPage) => --currentPage)
        }
      >{`<`}</button>
      <span>
        <b>
          Pagina {currentPage} de {totalNumberPages}
        </b>
      </span>
      <button
        onClick={() =>
          currentPage < totalNumberPages &&
          setCurrentPage((currentPage) => ++currentPage)
        }
      >{`>`}</button>
    </div>
  );
};

const getEnumerable = (arr) => {
  const resp = arr.map((_, index) => ++index).slice(0, 4);
  return resp.join(",") + (arr.length > 4 ? ",..." : "");
};
