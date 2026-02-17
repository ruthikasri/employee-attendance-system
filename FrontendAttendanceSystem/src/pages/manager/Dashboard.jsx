import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function Dashboard(){

  const [data,setData] = useState(null);

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async ()=>{
    try{
      const res = await api.get("/attendance/analytics");
      setData(res.data);
    }catch(err){
      console.log(err);
    }
  };

  if(!data) return <h2>Loading Dashboard...</h2>;

  return(
    <div>

      <h1 style={{marginBottom:"30px"}}>Manager Dashboard</h1>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3, 250px)",
        gap:"25px"
      }}>

        <div style={card("#22c55e")}>
          <h2>{data.regular}</h2>
          <p>Regular Employees</p>
        </div>

        <div style={card("#f59e0b")}>
          <h2>{data.irregular}</h2>
          <p>Irregular Employees</p>
        </div>

        <div style={card("#ef4444")}>
          <h2>{data.lowProductive}</h2>
          <p>Low Productivity</p>
        </div>

      </div>
    </div>
  );
}

const card = (color)=>({
  background:color,
  color:"white",
  padding:"30px",
  borderRadius:"15px",
  textAlign:"center",
  fontSize:"20px",
  fontWeight:"bold"
});
