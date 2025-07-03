// src/store/hooks.js
import { useDispatch, useSelector } from 'react-redux';

// Hooks tipados para usar en toda la aplicación
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;