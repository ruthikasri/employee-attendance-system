import { useEffect,useState } from "react";
import API from "../../utils/api";
import { PieChart,Pie,Cell,Legend,Tooltip } from "recharts";

export default function TeamSummary(){

  const [data,setData]=useState([]);

  useEffect(()=>{
    API.get("/attendance/analytics")
    .then(res=>{
      setData([
        {name:"Regular Employees",value:res.data.regular},
        {name:"Irregular Employees",value:res.data.irregular},
        {name:"Low Productive",value:res.data.lowProductive}
      ]);
    });
  },[]);

  const COLORS=["#00C49F","#FF8042","#FFBB28"];

  return(
    <div style={{textAlign:"center",marginTop:"40px"}}>
      <h2>Team Performance</h2>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map((entry,index)=>(
            <Cell key={index} fill={COLORS[index%COLORS.length]}/>
          ))}
        </Pie>

        <Tooltip/>
        <Legend/>
      </PieChart>
    </div>
  );
}
