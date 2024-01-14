import React from "react";
import { TextContainer } from "@/components/container";
import "./style.css";
import { ProjectContent, ProjectConfigure } from ".";
import { createContext, useContext, useState } from "react";
import { ProjectManageProvider } from "./ProjectManageProvider";
import { ProjectManageGeneral } from "./ProjectManageGeneral";
import { useParams } from "react-router";


export const ProjectManagement = ({own}) => {
  const id = useParams();
  // console.log(own) 

  return (
    <ProjectManageProvider own={own} projectId={id} >

        <ProjectManageGeneral />

    </ProjectManageProvider>

  );
};

