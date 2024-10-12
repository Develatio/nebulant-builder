import { useRef } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/esm/Card"
import Button from "react-bootstrap/esm/Button";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import Dropdown from "react-bootstrap/esm/Dropdown";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import CloseButton from "react-bootstrap/esm/CloseButton";

import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

export const WidgetRow = (props) => {
  const ref = useRef(null);
  const { rearrangeElements, index, dnd } = props;

  const [{ handlerId }, drop] = useDrop({
    accept: "WidgetRow",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },

    hover(item, monitor) {
      if(!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if(dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items
      // height. When dragging downwards, only move when the cursor is below
      // 50%. When dragging upwards, only move when the cursor is above 50%
      // dragging downwards
      if(dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if(dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      rearrangeElements(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here! Generally it's better to
      // avoid mutations, but it's good here for the sake of performance to
      // avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: "WidgetRow",
    item: () => ({ index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(ref);

  return (
    <Col
      sm={props.itemSize || 6}
      className="px-4 d-flex"
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
    >
      <Row className="widget-row position-relative border rounded px-1 py-3 flex-grow-1" ref={preview}>
        <Col sm={12}>
          {props.children}
        </Col>

        <div
          className="d-flex position-absolute top-0 start-50 w-auto p-0 rounded-circle"
          style={{
            transform: "translateX(-100%)",
          }}
        >
          {
            dnd && (
              <div className="pointer mt-n1" ref={drag}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#999" viewBox="0 0 16 16">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
              </div>
            )
          }
        </div>
        <div className="d-flex position-absolute top-0 start-100 w-auto translate-middle p-0 rounded-circle">
          <CloseButton
            className="p-0 btn-red border border-danger rounded-circle"
            onClick={() => props.form.delete(props.path, props.index)}
          ></CloseButton>
        </div>
      </Row>
    </Col>
  );
}

export const ArrayOfWidgets = (props) => {
  /*
    choices should be an array of objects with the following schema:
    {
      name: "foo",
      value: "bar",
    }
  */
  const add = (choice) => {
    props.form.append(props.path, {
      __uniq: Date.now(),
      name: choice.name,
      value: choice.value,
    })
  }

  const currentlySelected = props.form.get(props.path).map(v => v.name);
  const choices = props.choices.filter(
    choice => currentlySelected.indexOf(choice.name) == -1 || choice.multiple
  );

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  return (
    <DndProvider backend={HTML5Backend}>
      <FormGroup
        className={`
          array-of-widgets
          form-group
          ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" }
          ${props.className || ""}
        `}
        as={Row}
      >
        <FormLabel>{props.label}</FormLabel>

        <Col sm={12}>
          <Card className="border-0">
            {
              props.children?.length ? (
                <Card.Body className="border border-bottom-0 rounded-top bg-almost-dark">
                  <Row className="row-gap-3">
                    {props.children}
                  </Row>
                </Card.Body>
              ) : (
                <span className="py-3 px-2 text-secondary border border-bottom-0 rounded-top bg-almost-dark">
                  There are no items.
                </span>
              )
            }

            {
              choices.length == 0 ? (
                ""
              ) : choices.length == 1 && props.choices.length == 1 ? (
                <Button
                  className="rounded-top-0"
                  variant="outline-primary"
                  onClick={() => add(choices[0])}
                >{props.add_new_text || "Add new"}</Button>
              ) : (
                <Dropdown className="opts-selector border border-top-0 border-bottom-0 border-transparent">
                  <Dropdown.Toggle variant="outline-primary w-100 rounded-top-0">{props.add_new_text || "Add new"}</Dropdown.Toggle>
                  <Dropdown.Menu className="w-100 text-center">
                    {
                      choices.map((choice, index) => (
                        <Dropdown.Item className="w-100" key={index} onClick={() => add(choice)}>
                          {choice.label}
                        </Dropdown.Item>
                      ))
                    }
                  </Dropdown.Menu>
                </Dropdown>
              )
            }
          </Card>
        </Col>

        <Col sm={12} className="helpers">
          {
            warnings?.slice(0, 1).map((err, idx) =>
              <Feedback key={`warning_${attrs.name}_${idx}`} className="d-inline px-2 me-2 warning" type="invalid" tooltip>{err.message}</Feedback>
            )
          }

          {
            errors?.slice(0, 1).map((err, idx) =>
              <Feedback key={`error_${attrs.name}_${idx}`} className="d-inline px-2 me-2 error" type="invalid" tooltip>{err.message}</Feedback>
            )
          }

          <FormText className="text-muted">{props.help_text}</FormText>
        </Col>
      </FormGroup>
    </DndProvider>
  );
}
