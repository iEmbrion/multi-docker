import { useState, useEffect } from "react";
import axios from "axios";

const Fib = () => {
  const defaultState = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  const [fib, setFib] = useState(defaultState);

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get("/api/values/all");
    setFib((prevState) => {
      return { ...prevState, seenIndexes: seenIndexes.data };
    });
  };

  const fetchValues = async () => {
    const values = await axios.get("/api/values/current");
    setFib((prevState) => {
      return { ...prevState, values: values.data };
    });
  };

  useEffect(() => {
    fetchValues();
  }, []);

  useEffect(() => {
    fetchIndexes();
  }, []);

  //Portgres returns array of objects as default return type
  const renderSeenIndexes = () =>
    fib.seenIndexes.map(({ number }) => number.toString() + ", ");

  //Redis return object of key value pairs
  const renderValues = () => {
    const entries = [];

    for (let key in fib.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {fib.values[key]}
        </div>
      );
    }

    return entries;
  };

  //Event handlers
  const inputChangeHandler = (event) => {
    setFib((prevState) => {
      return {
        ...prevState,
        index: event.target.value,
      };
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    await axios.post("/api/values", {
      index: fib.index,
    });

    setFib((prevState) => {
      return {
        ...prevState,
        index: "",
      };
    });

    await fetchIndexes();
    await fetchValues();
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <label> Enter your index:</label>
        <input value={fib.index} onChange={inputChangeHandler} />
        <button> Submit </button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
