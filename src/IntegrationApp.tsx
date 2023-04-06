import { FC, useCallback, useEffect, useState } from 'react';
import { createManagementClient } from '@kontent-ai/management-sdk';
import Multiselect from 'multiselect-react-dropdown';

export type SelectOption = {
  name: string,
  id: string,
}

export const IntegrationApp: FC = () => {
  const [projectId, setProjectId] = useState<string | "">("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [itemName, setItemName] = useState<string | null>(null);
  const [watchedElementValue, setWatchedElementValue] = useState<string | null>(null);
  const [elementValue, setElementValue] = useState<SelectOption | null>(null);
  const [users, setUsers] = useState<ReadonlyArray<SelectOption | null>>([]);

  const updateWatchedElementValue = useCallback((codename: string) => {
    CustomElement.getElementValue(codename, v => typeof v === 'string' && setWatchedElementValue(v));
  }, []);

  useEffect(() => {
    CustomElement.init((element, context) => {
      setProjectId(context.projectId);
      setIsDisabled(element.disabled);
      setItemName(context.item.name);
      setElementValue(element.value ?? '');
    });
  }, [updateWatchedElementValue]);

  useEffect(() => {
    CustomElement.setHeight(500);
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
      subscriptionId: 'f922dbc9-a65b-47a7-94e6-0a99e64e9e6b', // optional, but required for Subscription related endpoints
      apiKey: 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogIjJiYzhiNWFhMTZkMjQxMDRhMWEzYjc3ZjNkY2I5NDFmIiwNCiAgImlhdCI6ICIxNjgwNzcwMDg0IiwNCiAgImV4cCI6ICIxNzQzOTI4NDQwIiwNCiAgInZlciI6ICIzLjAuMCIsDQogICJ1aWQiOiAieTBxNnhtRFNiaTFNS2NGZXA4MUtieTd4Y1hFWWk5dncxeVZhMmdkQWlyayIsDQogICJzdWJzY3JpcHRpb25faWQiOiAiZjkyMmRiYzlhNjViNDdhNzk0ZTYwYTk5ZTY0ZTllNmIiLA0KICAiYXVkIjogIm1hbmFnZS5rZW50aWNvY2xvdWQuY29tIg0KfQ.Go5DY5uteC_SL1DNmKliyYMJskPI6K11ld5-jItVd-g' // Content management API token
    });
    client.listSubscriptionUsers().toPromise().then(users => setUsers(users.data.items.map(user => ({
      name: user.firstName + " " + user.lastName,
      id: user.id
    }))));

  }, []);

  const onSelect = (selectedList: SelectOption, selectedItem: SelectOption) => {
    console.log(selectedItem)
    setElementValue(selectedList);
  }
  const onRemove = (selectedList: SelectOption, removedItem: SelectOption) => {
    setElementValue(selectedList);
  }

  return (
    <>
      <h1>
        This is a great integration with the Kontent.ai app.
      </h1>
      <section>
        <Multiselect
          options={users} // Options to display in the dropdown
          onSelect={onSelect} // Function will trigger on select event
          onRemove={onRemove} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />
      </section>
    </>
  );
};

IntegrationApp.displayName = 'IntegrationApp';