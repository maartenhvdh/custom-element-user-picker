import { FC, useCallback, useEffect, useState } from 'react';
import { createManagementClient } from '@kontent-ai/management-sdk';
import Multiselect from 'multiselect-react-dropdown';
import { User } from './types/user'


export const IntegrationApp: FC = () => {
  const [projectId, setProjectId] = useState<string | "">("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [itemName, setItemName] = useState<string | null>(null);
  const [elementValue, setElementValue] = useState<ReadonlyArray<User>>([]);
  const [users, setUsers] = useState<ReadonlyArray<User | null>>([]);

  const updateValue = useCallback((newValue: ReadonlyArray<User>) => {
    // send null instead of [] so that the element fails validation when it should not be empty
    CustomElement.setValue(newValue.length ? JSON.stringify(newValue) : null);
    setElementValue(newValue);
  }, []);

  useEffect(() => {
    CustomElement.init((element, context) => {
      setProjectId(context.projectId);
      setIsDisabled(element.disabled);
      setItemName(context.item.name);
      const value = JSON.parse(element.value || '[]');
      setElementValue(Array.isArray(value) ? value : [value]);
    });
  }, [updateValue]);

  useEffect(() => {
    CustomElement.setHeight(100);
  }, []);

  useEffect(() => {
    CustomElement.onDisabledChanged(setIsDisabled);
  }, []);

  useEffect(() => {
    CustomElement.observeItemChanges(i => setItemName(i.name));
  }, []);


  useEffect(() => {
    const client = createManagementClient({
      projectId: projectId, // id of your Kontent.ai environment
      subscriptionId: '397f37ec-a2b9-4675-9d6a-5d5e44e03bbb', // optional, but required for Subscription related endpoints
      apiKey: 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogIjE2ZGZlMzcxMDhkYjQ4NmY4MTc1YjAyM2FhN2ViMDFhIiwNCiAgImlhdCI6ICIxNjgwNzg1MDk5IiwNCiAgImV4cCI6ICIxNzI4MjE4NjQwIiwNCiAgInZlciI6ICIzLjAuMCIsDQogICJ1aWQiOiAieTBxNnhtRFNiaTFNS2NGZXA4MUtieTd4Y1hFWWk5dncxeVZhMmdkQWlyayIsDQogICJzdWJzY3JpcHRpb25faWQiOiAiMzk3ZjM3ZWNhMmI5NDY3NTlkNmE1ZDVlNDRlMDNiYmIiLA0KICAiYXVkIjogIm1hbmFnZS5rZW50aWNvY2xvdWQuY29tIg0KfQ.rseUuCItAwyqgf7Z7O9-UkT1bWq8jdNxP474MnXU7zU' // Content management API token
    });
    client.listSubscriptionUsers().toPromise().then(users => setUsers(users.data.items.map(user => ({
      name: user.firstName + " " + user.lastName,
      id: user.id
    }))));

  }, []);

  const onSelect = (selectedList: User[], selectedItem: User) => {
    updateValue(selectedList)
  }
  const onRemove = (selectedList: User[], removedItem: User) => {
    updateValue(selectedList)
  }

  return (
      <section>
        <Multiselect
          options={users} // Options to display in the dropdown
          selectedValues={elementValue}
          onSelect={onSelect} // Function will trigger on select event
          onRemove={onRemove} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />
      </section>
  );
};

IntegrationApp.displayName = 'IntegrationApp';