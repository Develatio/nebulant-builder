import { useEffect, useState } from "react";

import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

import { EventBus } from "@src/core/EventBus";
import { WBody } from "@src/ui/structure/WModal/WBody";
import { WModal } from "@src/ui/structure/WModal/WModal";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import deps from "./deps.json";

const CONTRIBUTORS = [
  {
    name: "Juan Antonio Nache",
    email: "nache@develat.io",
    role: "Full-stack",
  },
  {
    name: "Alexander Nestorov",
    email: "alexander@develat.io",
    role: "Full-stack",
  },
  {
    name: "Óscar M. Lage",
    email: "info@oscarmlage.com",
    role: "Full-stack",
  },
  {
    name: "Alvaro Martin Duran",
    email: "alvaromartindu@gmail.com",
    role: "Design",
  },
];

const parseDep = (dep) => {
  if(dep.name.lastIndexOf("@npm") > -1) {
    [dep.name] = dep.name.split("@npm");
  } else if (dep.name.lastIndexOf("@workspace") > -1) {
    [dep.name] = dep.name.split("@workspace");
  }

  if(dep.version === "0.0.0-use.local") {
    dep.version = "*";
  }

  if(dep.name.lastIndexOf("@joint") > -1) {
    if(dep.name !== "@joint/core") {
      dep.license = "JointJS+ License";
    }

    dep.version = "4.*";
  }

  return dep;
}

export const About = () => {
  const [visible, setVisible] = useState(false);

  const close = () => setVisible(false);
  const open = (_msg, _data) => setVisible(true);

  useEffect(() => {
    const eventBus = new EventBus();

    eventBus.subscribe("OpenAbout", open);
    eventBus.subscribe("CloseAbout", close);

    return () => {
      eventBus.unsubscribe("OpenAbout", open);
      eventBus.unsubscribe("CloseAbout", close);
    };
  }, []);

  if(!visible) return "";

  return (
    <WModal
      size="md"
      visible={visible}
      close={close}
    >
      <Container>
        <WHeader>About Nebulant...</WHeader>

        <WBody scrollable={true}>
          <div className="d-flex flex-column gap-4 about">
            <div>
              <h5 className="m-0 p-0 text-gradient-nebulant">
                Nebulant Builder v{ process.env.VERSION }
              </h5>
            </div>

            <div className="d-flex gap-2">
              <div className="contributors d-flex flex-column gap-2">
                <span>Proudly brought to you by:</span>
                <ul className="m-0 ps-2 small text-muted">
                  {
                    CONTRIBUTORS.sort(() => .5 - Math.random()).map((c, idx) => (
                      <li key={idx}>
                        <a href={`mailto:${c.email}`}>{c.name}</a> - {c.role}
                      </li>
                    ))
                  }
                </ul>
                <div className="small text-muted d-flex flex-column">
                  <span className="">Thank you for using Nebulant,</span>
                  <span className="fst-italic">The Develatio team</span>
                </div>
              </div>

              <div className="logo"></div>
            </div>

            <div className="libs d-flex flex-column gap-2">
              <span>This project is licensed under the
                <a
                  className="ms-1"
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  target="_blank"
                  rel="noreferrer"
                >GNU GPL v3 license</a>
              </span>
              <ul className="m-0 ps-2 py-2 border rounded text-bg-dark">
                {
                  deps.filter(dep => {
                    return dep.name.indexOf("nebulant")
                  }).map((dep, idx) => {
                    dep = parseDep(dep);

                    return (
                      <li key={idx} className="d-flex gap-1">
                        {
                          dep.website ?
                          <a target="_blank" rel="noreferrer" href={dep.website}>{dep.name}</a> :
                          <span>{ dep.name }</span>
                        }
                        <span>({dep.version}) - {dep.license}</span>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </WBody>

        <WFooter>
          <Button variant="primary" className="" onClick={close}>Ok</Button>
        </WFooter>
      </Container>
    </WModal>
  );
}
