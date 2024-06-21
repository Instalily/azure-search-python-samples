import React from 'react';
import './NoResults.css';

import a1 from '../../images/appliance/a1.svg';
import a2 from '../../images/appliance/a2.svg';
import a3 from '../../images/appliance/a3.svg';
import a4 from '../../images/appliance/a4.svg';
import a5 from '../../images/appliance/a5.svg';
import a6 from '../../images/appliance/a6.svg';
import a7 from '../../images/appliance/a7.svg';
import a8 from '../../images/appliance/a8.svg';
import a9 from '../../images/appliance/a9.svg';
import a10 from '../../images/appliance/a10.svg';
import a11 from '../../images/appliance/a11.svg';
import a12 from '../../images/appliance/a12.svg';

export default function NoResults() {
  return (
    <div className="no-results">
        <div className="header">
            <h2>We Couldn't Find A Match For 'userquery'</h2>
        </div>
        <div className="content">
            <div className="left">
                <b>Sorry, we were unable to find a match for your search 'userquery','</b> but we probably have the repair part you're looking for.
                <p />
                The best way to find what you're looking for is to <b>make sure your model or part number is accurate and complete.</b>
                <p />
                <a href="">Locate Your Appliance Model Number</a>
                <p />
                <a href="/">Locate Your Lawn Equipment Model Number</a>
            </div>
            <div className="right">
                <h4>Why do we need your model number?</h4>
                <p />
                Every model has its own specific solutions. If you go to a car mechanic they’ll need to know the exact make and model of your car to find the right repair parts. Appliances are the same.
            </div>
        </div>

        <div className="header">
            <h4>Locating Your Appliance Model Number</h4>
        </div>
        <div className="content">
            <div>
                If you are not sure where to locate your appliance's model number, select your product from the following list. We have provided diagrams of common model number locations for each type of appliance.
                <p />
            </div>
        </div>

        <div className="grid-container">
            <div className="grid-item">
                <div className="image-container"><img src={a1} alt="appliance 1" style={{ width: '100px' }} /></div>
                <div><a href="/" className="link-large">Air Conditioner</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a2} alt="appliance 2" style={{ width: '90px' }} /></div>
                <div><a href="/" className="link-small">Dehumidifier</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a3} alt="appliance 3" style={{ width: '80px' }}/></div>
                <div><a href="/" className="link-medium">Dishwasher</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a4} alt="appliance 4" style={{ width: '90px' }} /></div>
                <div><a href="/" className="link-large">Dryer</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a5} alt="appliance 5" style={{ width: '100px' }} /></div>
                <div><a href="/" className="link-small">Food Waste Disposer</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a6} alt="appliance 6" style={{ width: '90px' }} /></div>
                <div><a href="/" className="link-medium">Freezer</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a7} alt="appliance 7" style={{ width: '100px' }} /></div>
                <div><a href="/" className="link-large">Microwave</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a8} alt="appliance 8" style={{ width: '90px' }} /></div>
                <div><a href="/" className="link-small">Range</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a9} alt="appliance 9" style={{ width: '65px' }} /></div>
                <div><a href="/" className="link-medium">Refrigerator</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a10} alt="appliance 10" style={{ width: '100px' }} /></div>
                <div><a href="/" className="link-large">Trash Compactor</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a11} alt="appliance 11" style={{ width: '80px' }} /></div>
                <div><a href="/" className="link-small">Washer</a></div>
            </div>
            <div className="grid-item">
                <div className="image-container"><img src={a12} alt="appliance 12" style={{ width: '65px' }} /></div>
                <div><a href="/" className="link-medium">Water Heater</a></div>
            </div>
        </div>

        <div className="header">
            <h4>Locating Your Lawn Equipment Model Number</h4>
        </div>
        <div className="content">
            <div>
                To find the model number on your lawn equipment, you may have to look in different places depending on what type of equipment you have and what kind of parts you're looking for.
                <p />
                <b>Non-Hand Held Equipment</b> For most lawn equipment that is not hand held, there will be two model numbers: one for the engine and one for the equipment itself.
                <p />
                <b>Looking for Engine Parts?</b> Use the engine model number which is often stamped or engraved on the engine itself. You may also find this model number near the spark plug, the air filter or the muffler. In some cases, it may be found on an ID tag.
                <p />
                <b>Looking for Non-Engine Parts?</b> Use the model number found on the equipment itself. This will normally be a printed label or an ID tag, and can usually be found on the frame or supports, underneath the seat, under the foot plate, or near the wheels.
                <p />
                <b>Hand Held Equipment</b> For most lawn equipment that is hand held, there is only one model number. To locate the model number, check the side of the motor casing, the back near the handle, or on the bottom of the casing.
            </div>
        </div>

        <div className="header">
            <h4>Searching with your part number</h4>
        </div>
        <div className="content">
            <div>
                You must type <b>the complete part number into the search box</b> to locate your part (no partial matches). Part numbers printed on the part may not be correct. If you are not sure about your part number search by model number.
            </div>
        </div>
    </div>
  );
};
