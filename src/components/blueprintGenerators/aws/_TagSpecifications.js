// This function accepts an array of objects. Each object
// should have a single key called "values" and it's value
// should be an array of two string values.
//
//  [
//    {values: ["foo", "bar]},
//    {values: ["abc", "xyz]},
//  ]
//
// The second parameter is the resource type.
//
// It will return a TagSpecification object
// https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/service/ec2@v1.26.0/types#TagSpecification
export const tagsFromArrayOfObjects = (arr, resourceType) => {
  return {
    ResourceType: resourceType,
    Tags: arr.map(tag => ({
      Key: `${tag.value[0]}`,
      Value: `${tag.value[1]}`,
    })),
  };
}
