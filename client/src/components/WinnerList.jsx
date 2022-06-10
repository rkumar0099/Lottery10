import React from 'react';
import '../style/global.css';


const WinnerList = (props) => {
    const keys = ["Address", "Round", "Amount"];
    const list = props.winners;

    const Heading = () => {
        return keys.map(data => {
            return <th className="col-heading">{data}</th>
        });
    };

    const Data = () => {
        return list.map(winner => {
            return (
                <tr>
                    {
                        keys.map(key => {
                            if (key == "Amount") {
                            return <td className="col-data">{winner[key]} eth</td>
                            } else {
                                return <td className="col-data">{winner[key]}</td>
                            }
                        })
                    }
                </tr>
            )
        });
    }

    const handleBack = async () => {
        await props.flag(props.backFlag);
    }

    const handleWinnersClick = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="landing">
        <div className="header">
            <div className="app-title">LOTTERY10</div>
            <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
        </div>
        <div className="table-container">
            <div className="table">
                <table>
                    <tr>
                        <Heading />
                    </tr>
                    <Data />
                </table>
            </div>
            <div className="table-go-back" onClick={handleBack}>Go Back</div>
        </div>
        <p className="footer">
            &copy;2022 React App. All rights reserved
        </p>
        </div>
    )
}

export default WinnerList;
