import React from "react";
import Layout from "../components/Layout";
import Zone from "../components/dashboardComponents/Zone";
import HTS from "../components/dashboardComponents/HTS";
import MeasurementConfiguration from "../components/dashboardComponents/MeasurementConfiguration";
import SystemAlerts from "../components/dashboardComponents/SystemAlerts";
import Calendar from "../components/dashboardComponents/Calendar";
//import Searcher from "../components/dashboardComponents/Searcher";
import StateContainerChart from "../components/dashboardComponents/StateContainerChart";
import ContainerFilling from "../components/dashboardComponents/ContainerFilling";
import GeneralState from "../components/dashboardComponents/GeneralState";
//import Tune from "../components/dashboardComponents/Tune";

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="flex h-screen w-full p-4 gap-4">
        <div className="w-1/4 flex flex-col gap-4">
          <div className="h-[7%] flex rounded-xl bg-dark-primary">
            <Zone />
          </div>
          <div className="h-[93%] flex rounded-xl bg-dark-primary">
            <HTS />
          </div>
        </div>
        <div className="w-3/4 flex flex-col gap-4">
          <div className="flex flex-col h-3/4">
            <div className="h-full">
              <div className="flex flex-row h-full gap-4">
                <div className="flex flex-col w-1/3">
                  <div className="flex flex-col h-full gap-4">
                    <div className="h-1/6 flex bg-dark-primary gap-4 p-2 rounded-xl">
                      <MeasurementConfiguration />
                    </div>
                    <div className="h-5/6 flex bg-dark-primary gap-4 rounded-xl w-full">
                      <SystemAlerts />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-2/3 gap-4">
                  <div className="flex flex-row h-[55%] gap-4">
                    <div className="flex w-1/2">
                      <div className="bg-dark-primary p-2 rounded-xl w-full">
                        <h2 className="text-xl font-bold mb-2 h-full">
                          <Calendar />
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col w-1/2 gap-4">
                      {/* <div className="flex h-[13%] gap-4"> */}
                        {/* <div className="bg-dark-primary rounded-xl w-[87%] p-2">
                          <h2 className="text-xl font-bold">
                            <Searcher />
                          </h2>
                        </div> */}
                        {/* <div className="bg-dark-primary rounded-xl w-[13%] p-2">
                          <h2 className="text-xl font-bold">
                            <Tune />
                          </h2>
                        </div> */}
                      {/* </div> */}
                      {/* <div className="flex h-[87%] p-2 bg-dark-primary rounded-xl"> */}
                      <div className="flex h-[100%] bg-dark-primary rounded-xl">
                        <GeneralState />
                      </div>
                    </div>
                  </div>
                  <div className="flex h-[45%] rounded-xl w-full bg-dark-primary">
                    <StateContainerChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-1/4 gap-4">
            <div className="h-full bg-dark-primary rounded-xl">
              <ContainerFilling />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
