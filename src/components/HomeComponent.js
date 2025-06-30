import img from '../../src/images/autodesk.png';

const HomeComponent = () => {
    return (
        <div className="home-container">
            <img src={img} />
            <h1>Autodesk Assistant</h1>
            <h2>Ask a question for a nice streaming experience!</h2>
        </div>
    )
};

export default HomeComponent;