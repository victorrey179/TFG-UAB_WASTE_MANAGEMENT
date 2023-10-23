import React, { useState } from "react";
import Layout from "../components/Layout";

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="flex h-screen w-full mt-2 mb-2 gap-2">
        <div className="w-1/4 flex flex-col gap-2">
          <div className="h-full flex rounded-xl bg-dark-primary">
            <h2 className="text-xl font-bold mb-2">Filtros</h2>
          </div>
          <div className="h-full flex rounded-xl bg-dark-primary">
            <h2 className="text-xl font-bold mb-2">Filtros</h2>
          </div>
          <div className="h-full flex rounded-xl bg-dark-primary">
            <h2 className="text-xl font-bold mb-2">Filtros</h2>
          </div>
        </div>
        <div className="w-3/4 flex flex-col gap-2">
          <div className="flex flex-col h-3/4">
            <div className="h-full">
              <div className="flex flex-row h-full gap-2">
                <div className="flex flex-col w-1/3">
                  <div className="flex flex-col h-full gap-2">
                    <div className="h-1/3 flex bg-dark-primary gap-2 rounded-xl">
                      <h2 className="text-xl font-bold mb-2">
                        Gráfico de Ventas 1
                      </h2>
                    </div>
                    <div className="h-2/3 flex bg-dark-primary gap-2 rounded-xl">
                      <h2 className="text-xl font-bold mb-2">
                        Gráfico de Ventas 2
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-2/3 gap-2">
                  <div className="flex flex-row h-[55%] gap-2">
                    <div className="flex w-1/2">
                      <div className="w-full bg-dark-primary rounded-xl">
                        <h2 className="text-xl font-bold mb-2">
                          Gráfico de Ventas 1
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col w-1/2 gap-2">
                      <div className="flex h-1/6 bg-dark-primary rounded-xl">
                        <h2 className="text-xl font-bold mb-2">
                          Gráfico de Ventas 2
                        </h2>
                      </div>
                      <div className="flex h-5/6 bg-dark-primary rounded-xl">
                        <h2 className="text-xl font-bold mb-2">
                          Gráfico de Ventas 3
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col h-[45%] gap-2 bg-dark-primary">
                    <h2 className="text-xl font-bold mb-2">
                      Gráfico de Ventas 4
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-1/4 gap-2">
            <div className="h-full bg-dark-primary p-4 rounded-xl">
              <h2 className="text-xl font-bold mb-2">Presiones</h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
