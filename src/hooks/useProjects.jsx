import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, createProject } from '../features/projects/projectSlice';

export const useProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects);

  const getProjects = () => {
    return dispatch(fetchProjects());
  };

  const addProject = (projectData) => {
    return dispatch(createProject(projectData));
  };

  return {
    ...projects,
    getProjects,
    addProject
  };
}; 