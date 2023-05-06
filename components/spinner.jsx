import { PropagateLoader, ClockLoader
} from "react-spinners";
export default function saveSpinner({ fullWidth, type }) {
  if (fullWidth && type === 'save') {
    return (
        <div className="w-10% flex justify-center">
          <ClockLoader size={20} color={'#fff'}/>
        </div>
    );
  } else {
    return (
        <div className="w-full flex justify-center pb-4">
          <PropagateLoader color={'#1E3A8A'}/>
        </div>
    )}
}
