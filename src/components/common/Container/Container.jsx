// import {PropTypes} from "prop-types"

const Container = ({ children, maxWidth }) => {
  return (
    <div
      className={maxWidth ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5" : "container mx-auto py-5"}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {children}
    </div>
  );
};

export default Container;
// Container.propTypes = {
//     children: PropTypes.node
// }
