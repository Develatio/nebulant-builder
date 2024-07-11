import { useState, useEffect } from "react";
import QueryBuilder, {
  formatQuery,
  convertFromIC,
} from "react-querybuilder";
import * as ReactDnD from "react-dnd";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";

//import { NotToggle } from "./_NotToggle";
import { ValueEditor } from "./_ValueEditor";
import { FieldSelector } from "./_FieldSelector";
import { OperatorSelector } from "./_OperatorSelector";
import { CombinatorSelector } from "./_CombinatorSelector";

import { DiagramQL } from "@src/data/DiagramQL";

import Card from "react-bootstrap/esm/Card";
import Accordion from "react-bootstrap/esm/Accordion";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

export const ConditionSettings = (props) => {
  const [query, setQuery] = useState(props.form.get("parameters.conditions"));
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState([]);

  // TODO: Do something with props.validations?

  const logQuery = (query) => {
    let res = formatQuery(query, { format: "cel" });
    setResult(res);
    setQuery(query);

    // The "conditions" field is used to preserve the UI state and it contains
    // the query in "IC" ("independent combinators") format. We must also update
    // the "conditions_nonic" field with a query in "non-IC" format so that the
    // blueprinter can use that data during the blueprint generation process.
    props.form.set("parameters.conditions", query);
    props.form.set("parameters.conditions_nonic", convertFromIC(query));
  }

  useEffect(() => {
    const dql = new DiagramQL();

    let variables = dql.query(
      dql.vars_for_dropdown({ node: props.node })
    );

    variables = variables.map(variable => ({
      ...variable,
      name: variable.value,
      __locked: false,
    }));

    setOptions(variables);
  }, []);

  return (
    <Container>
      <WHeader help={props.help}>Condition settings</WHeader>

      <WBody>

        <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
          <QueryBuilder
            query={query}
            fields={options}
            getValues={() => options}

            operators={[
              { name: "=", label: "=" },
              { name: "!=", label: "!=" },
              { name: "<", label: "<" },
              { name: ">", label: ">" },
              { name: "<=", label: "<=" },
              { name: ">=", label: ">=" },
              { name: "contains", label: "contains" },
              { name: "beginsWith", label: "begins with" },
              { name: "endsWith", label: "ends with" },
              { name: "doesNotContain", label: "does not contain" },
              { name: "doesNotBeginWith", label: "does not begin with" },
              { name: "doesNotEndWith", label: "does not end with" },

              // TODO: Implement these 4
              //{ name: "null", label: "is null" },
              //{ name: "notNull", label: "is not null" },
              //{ name: "in", label: "in" },
              //{ name: "notIn", label: "not in" },

              // Do we need these?
              //{ name: "between", label: "between" },
              //{ name: "notBetween", label: "not between" }
            ]}

            controlClassnames={{
              queryBuilder: "queryBuilder-branches",
              addGroup: "btn btn-secondary btn-sm",
              addRule: "btn btn-primary btn-sm",
              removeGroup: "btn btn-danger btn-sm d-flex",
              removeRule: "btn btn-danger btn-sm d-flex",
            }}

            controlElements={{
              valueEditor: ValueEditor,
              fieldSelector: FieldSelector,
              operatorSelector: OperatorSelector,
              combinatorSelector: CombinatorSelector,
              //notToggle: NotToggle,
            }}

            enableDragAndDrop={true}
            autoSelectField={true}
            getDefaultField={() => ""}
            getDefaultValue={() => ""}
            resetOnOperatorChange={false}
            resetOnFieldChange={false}

            addRuleToNewGroups
            listsAsArrays
            showCombinatorsBetweenRules
            showNotToggle={false}

            onQueryChange={logQuery}
          />
        </QueryBuilderDnD>

        <hr />

        <Accordion>
          <Card>
            <Accordion.Item eventKey="0" className="border-0">
              <Card.Header className="p-1 border-0">
                <Accordion.Button className="p-1 pointer accordion-btn">
                  Preview generated condition
                </Accordion.Button>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <pre>{ result }</pre>
                </Card.Body>
              </Accordion.Collapse>
            </Accordion.Item>
          </Card>
        </Accordion>

      </WBody>

      <WFooter
        close={() => props.callbacks.close()}
        save={(force) => {
          props.callbacks.save(force);
        }}
        validations={props.validations}
      ></WFooter>
    </Container>
  )
}
