import { useContext } from 'react';
import { PlateContext } from '../context/PlateContext';
export default function usePlate(){
  return useContext(PlateContext);
}
