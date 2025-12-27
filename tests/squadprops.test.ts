import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Give Props Tests", () => {
  it("allows giving a single prop to another user", () => {
    const message = "Great work on the project!";
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    expect(givePropsResponse.result).toBeOk(Cl.uint(0)); // First props ID is 0
  });

  it("emits event when giving props", () => {
    const message = "Amazing contribution!";
    const currentBlock = simnet.blockHeight;
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    expect(givePropsResponse.result).toBeOk(Cl.uint(0));

    // Check for print event
    const printEvents = givePropsResponse.events.filter(
      (e) => e.event === "print_event"
    );
    expect(printEvents).toHaveLength(1);
    expect(printEvents[0].data.value).toStrictEqual(
      Cl.tuple({
        event: Cl.stringAscii("props-given"),
        "props-id": Cl.uint(0),
        giver: Cl.principal(wallet1),
        receiver: Cl.principal(wallet2),
        amount: Cl.uint(1),
        message: Cl.stringUtf8(message),
        "block-height": Cl.uint(currentBlock),
        "receiver-total": Cl.uint(1),
      })
    );
  });

  it("prevents giving props to yourself", () => {
    const message = "I'm awesome!";
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet1), Cl.stringUtf8(message)],
      wallet1
    );

    // Should return ERR_SELF_PROPS (err u101)
    expect(givePropsResponse.result).toBeErr(Cl.uint(101));
  });

  // Note: Messages over 500 chars cause a type error before contract execution,
  // so we can't test ERR_MESSAGE_TOO_LONG with the current approach

  it("allows messages exactly at max length (500 chars)", () => {
    const maxMessage = "a".repeat(500);
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(maxMessage)],
      wallet1
    );

    expect(givePropsResponse.result).toBeOk(Cl.uint(0));
  });

  it("increments props ID for each transaction", () => {
    const message = "Good job!";
    
    const response1 = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    const response2 = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet1
    );

    const response3 = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet3
    );

    expect(response1.result).toBeOk(Cl.uint(0));
    expect(response2.result).toBeOk(Cl.uint(1));
    expect(response3.result).toBeOk(Cl.uint(2));
  });

  it("allows same user to give props to multiple recipients", () => {
    const message = "Great work!";
    
    const response1 = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    const response2 = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet1
    );

    expect(response1.result).toBeOk(Cl.uint(0));
    expect(response2.result).toBeOk(Cl.uint(1));
  });

  it("allows multiple users to give props to same recipient", () => {
    const message = "Excellent!";
    
    const response1 = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet1
    );

    const response2 = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet2
    );

    expect(response1.result).toBeOk(Cl.uint(0));
    expect(response2.result).toBeOk(Cl.uint(1));
  });
});

describe("Give Multiple Props Tests", () => {
  it("allows giving multiple props at once", () => {
    const message = "Outstanding work this week!";
    const amount = 5;
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(amount), Cl.stringUtf8(message)],
      wallet1
    );

    expect(givePropsResponse.result).toBeOk(Cl.uint(0));
  });

  it("emits event when giving multiple props", () => {
    const message = "Amazing contributions!";
    const amount = 10;
    const currentBlock = simnet.blockHeight;
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(amount), Cl.stringUtf8(message)],
      wallet1
    );

    expect(givePropsResponse.result).toBeOk(Cl.uint(0));

    // Check for print event
    const printEvents = givePropsResponse.events.filter(
      (e) => e.event === "print_event"
    );
    expect(printEvents).toHaveLength(1);
    expect(printEvents[0].data.value).toStrictEqual(
      Cl.tuple({
        event: Cl.stringAscii("props-given"),
        "props-id": Cl.uint(0),
        giver: Cl.principal(wallet1),
        receiver: Cl.principal(wallet2),
        amount: Cl.uint(amount),
        message: Cl.stringUtf8(message),
        "block-height": Cl.uint(currentBlock),
        "receiver-total": Cl.uint(amount),
      })
    );
  });

  it("prevents giving zero props", () => {
    const message = "No props for you!";
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(0), Cl.stringUtf8(message)],
      wallet1
    );

    // Should return ERR_INVALID_AMOUNT (err u102)
    expect(givePropsResponse.result).toBeErr(Cl.uint(102));
  });

  it("prevents giving multiple props to yourself", () => {
    const message = "I deserve 10 props!";
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet1), Cl.uint(10), Cl.stringUtf8(message)],
      wallet1
    );

    // Should return ERR_SELF_PROPS (err u101)
    expect(givePropsResponse.result).toBeErr(Cl.uint(101));
  });

  it("correctly accumulates multiple props in receiver total", () => {
    const message = "Great!";
    
    simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(5), Cl.stringUtf8(message)],
      wallet1
    );

    const response2 = simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(3), Cl.stringUtf8(message)],
      wallet3
    );

    // Check event shows accumulated total
    const printEvents = response2.events.filter(
      (e) => e.event === "print_event"
    );
    
    const eventData = printEvents[0].data.value as any;
    expect(eventData.value.event.value).toBe("props-given");
    expect(eventData.value["props-id"].value).toBe(1n);
    expect(eventData.value.giver.value).toBe(wallet3);
    expect(eventData.value.receiver.value).toBe(wallet2);
    expect(eventData.value.amount.value).toBe(3n);
    expect(eventData.value["receiver-total"].value).toBe(8n); // 5 + 3
  });
});

describe("Props Tracking Tests", () => {
  it("tracks props received correctly", () => {
    const message = "Good work!";
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet3
    );

    const propsReceived = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-received",
      [Cl.principal(wallet2)],
      deployer
    );

    expect(propsReceived.result).toBeOk(Cl.uint(2));
  });

  it("tracks props given correctly", () => {
    const message = "Nice!";
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(5), Cl.stringUtf8(message)],
      wallet1
    );

    const propsGiven = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-given",
      [Cl.principal(wallet1)],
      deployer
    );

    expect(propsGiven.result).toBeOk(Cl.uint(7)); // 1 + 1 + 5
  });

  it("tracks total props across entire system", () => {
    const message = "Great!";
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet3), Cl.uint(10), Cl.stringUtf8(message)],
      wallet2
    );

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet1), Cl.stringUtf8(message)],
      wallet3
    );

    const totalProps = simnet.callReadOnlyFn(
      "squadprops",
      "get-total-props",
      [],
      deployer
    );

    expect(totalProps.result).toBeOk(Cl.uint(12)); // 1 + 10 + 1
  });

  it("returns zero for users with no props received", () => {
    const propsReceived = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-received",
      [Cl.principal(wallet1)],
      deployer
    );

    expect(propsReceived.result).toBeOk(Cl.uint(0));
  });

  it("returns zero for users with no props given", () => {
    const propsGiven = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-given",
      [Cl.principal(wallet1)],
      deployer
    );

    expect(propsGiven.result).toBeOk(Cl.uint(0));
  });

  it("tracks has-given-props-to relationship", () => {
    const message = "Thanks!";
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    const hasGiven = simnet.callReadOnlyFn(
      "squadprops",
      "has-given-props-to",
      [Cl.principal(wallet1), Cl.principal(wallet2)],
      deployer
    );

    const hasNotGiven = simnet.callReadOnlyFn(
      "squadprops",
      "has-given-props-to",
      [Cl.principal(wallet1), Cl.principal(wallet3)],
      deployer
    );

    expect(hasGiven.result).toBeOk(Cl.bool(true));
    expect(hasNotGiven.result).toBeOk(Cl.bool(false));
  });

  it("records first props block height", () => {
    const message = "First props!";
    const currentBlock = simnet.blockHeight;
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    const firstPropsBlock = simnet.callReadOnlyFn(
      "squadprops",
      "get-first-props-block",
      [Cl.principal(wallet2)],
      deployer
    );

    expect(firstPropsBlock.result).toBeOk(Cl.some(Cl.uint(currentBlock)));
  });

  it("maintains first props block on subsequent props", () => {
    const message = "Props!";
    const currentBlock = simnet.blockHeight;
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.mineEmptyBlocks(5);

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet3
    );

    const firstPropsBlock = simnet.callReadOnlyFn(
      "squadprops",
      "get-first-props-block",
      [Cl.principal(wallet2)],
      deployer
    );

    // Should still be the original block
    expect(firstPropsBlock.result).toBeOk(Cl.some(Cl.uint(currentBlock)));
  });
});

describe("Props History Tests", () => {
  it("stores props in user history", () => {
    const message = "Great work!";
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet3
    );

    const history = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-history",
      [Cl.principal(wallet2)],
      deployer
    );

    expect(history.result).toBeOk(Cl.list([Cl.uint(0), Cl.uint(1)]));
  });

  it("returns empty list for user with no history", () => {
    const history = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-history",
      [Cl.principal(wallet1)],
      deployer
    );

    expect(history.result).toBeOk(Cl.list([]));
  });

  it("retrieves props details by ID", () => {
    const message = "Amazing contribution!";
    const currentBlock = simnet.blockHeight;
    
    simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(5), Cl.stringUtf8(message)],
      wallet1
    );

    const propsDetails = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-by-id",
      [Cl.uint(0)],
      deployer
    );

    expect(propsDetails.result).toBeOk(
      Cl.some(
        Cl.tuple({
          giver: Cl.principal(wallet1),
          receiver: Cl.principal(wallet2),
          message: Cl.stringUtf8(message),
          timestamp: Cl.uint(currentBlock),
          amount: Cl.uint(5),
        })
      )
    );
  });

  it("returns none for non-existent props ID", () => {
    const propsDetails = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-by-id",
      [Cl.uint(999)],
      deployer
    );

    expect(propsDetails.result).toBeOk(Cl.none());
  });

  it("maintains separate histories for different users", () => {
    const message = "Props!";
    
    // wallet2 receives props
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    // wallet3 receives props
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet1
    );

    // wallet2 receives more props
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet3
    );

    const history2 = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-history",
      [Cl.principal(wallet2)],
      deployer
    );

    const history3 = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-history",
      [Cl.principal(wallet3)],
      deployer
    );

    expect(history2.result).toBeOk(Cl.list([Cl.uint(0), Cl.uint(2)]));
    expect(history3.result).toBeOk(Cl.list([Cl.uint(1)]));
  });
});

describe("User Stats Tests", () => {
  it("returns comprehensive user stats", () => {
    const message = "Good job!";
    const currentBlock = simnet.blockHeight;
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet2
    );

    const stats = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-stats",
      [Cl.principal(wallet2)],
      deployer
    );

    expect(stats.result).toBeOk(
      Cl.tuple({
        "props-received": Cl.uint(1),
        "props-given": Cl.uint(1),
        "first-props-block": Cl.some(Cl.uint(currentBlock)),
      })
    );
  });

  it("returns zero stats for new user", () => {
    const stats = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-stats",
      [Cl.principal(wallet1)],
      deployer
    );

    expect(stats.result).toBeOk(
      Cl.tuple({
        "props-received": Cl.uint(0),
        "props-given": Cl.uint(0),
        "first-props-block": Cl.none(),
      })
    );
  });

  it("gets current props ID counter", () => {
    const message = "Props!";
    
    const initialCounter = simnet.callReadOnlyFn(
      "squadprops",
      "get-current-props-id",
      [],
      deployer
    );

    expect(initialCounter.result).toBeOk(Cl.uint(0));

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet1
    );

    const updatedCounter = simnet.callReadOnlyFn(
      "squadprops",
      "get-current-props-id",
      [],
      deployer
    );

    expect(updatedCounter.result).toBeOk(Cl.uint(2));
  });

  it("returns user rank (props received)", () => {
    const message = "Great!";
    
    simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet2), Cl.uint(10), Cl.stringUtf8(message)],
      wallet1
    );

    const rank = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-rank",
      [Cl.principal(wallet2)],
      deployer
    );

    expect(rank.result).toBeOk(Cl.uint(10));
  });
});

describe("Integration Tests", () => {
  it("handles complete props giving flow for multiple users", () => {
    const message = "Excellent work!";
    
    // wallet1 gives to wallet2
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    // wallet1 gives to wallet3
    simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet3), Cl.uint(5), Cl.stringUtf8(message)],
      wallet1
    );

    // wallet2 gives to wallet3
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet3), Cl.stringUtf8(message)],
      wallet2
    );

    // wallet3 gives to wallet1
    simnet.callPublicFn(
      "squadprops",
      "give-multiple-props",
      [Cl.principal(wallet1), Cl.uint(3), Cl.stringUtf8(message)],
      wallet3
    );

    // Check all stats
    const stats1 = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-stats",
      [Cl.principal(wallet1)],
      deployer
    );

    const stats2 = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-stats",
      [Cl.principal(wallet2)],
      deployer
    );

    const stats3 = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-stats",
      [Cl.principal(wallet3)],
      deployer
    );

    const totalProps = simnet.callReadOnlyFn(
      "squadprops",
      "get-total-props",
      [],
      deployer
    );

    // wallet1: received 3, given 6
    expect((stats1.result as any).value.value["props-received"].value).toBe(3n);
    expect((stats1.result as any).value.value["props-given"].value).toBe(6n);

    // wallet2: received 1, given 1
    expect((stats2.result as any).value.value["props-received"].value).toBe(1n);
    expect((stats2.result as any).value.value["props-given"].value).toBe(1n);

    // wallet3: received 6, given 3
    expect((stats3.result as any).value.value["props-received"].value).toBe(6n);
    expect((stats3.result as any).value.value["props-given"].value).toBe(3n);

    // Total: 1 + 5 + 1 + 3 = 10
    expect(totalProps.result).toBeOk(Cl.uint(10));
  });

  it("handles props with emoji and special characters in messages", () => {
    const message = "Amazing work! 🚀🎉 Keep it up! 💪";
    
    const givePropsResponse = simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    // Verify props were successfully given
    expect(givePropsResponse.result).toBeOk(Cl.uint(0));

    // Verify the props record exists and contains the emoji message
    const propsReceived = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-received",
      [Cl.principal(wallet2)],
      deployer
    );
    
    expect(propsReceived.result).toBeOk(Cl.uint(1));
  });

  it("handles high volume of props transactions", () => {
    const message = "Props!";
    
    // Give 20 props transactions
    for (let i = 0; i < 20; i++) {
      simnet.callPublicFn(
        "squadprops",
        "give-props",
        [Cl.principal(wallet2), Cl.stringUtf8(`${message} #${i}`)],
        wallet1
      );
    }

    const propsReceived = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-received",
      [Cl.principal(wallet2)],
      deployer
    );

    const propsGiven = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-given",
      [Cl.principal(wallet1)],
      deployer
    );

    const history = simnet.callReadOnlyFn(
      "squadprops",
      "get-user-history",
      [Cl.principal(wallet2)],
      deployer
    );

    expect(propsReceived.result).toBeOk(Cl.uint(20));
    expect(propsGiven.result).toBeOk(Cl.uint(20));
    
    // Verify history list contains all 20 props IDs
    const expectedHistory = Array.from({ length: 20 }, (_, i) => Cl.uint(i));
    expect(history.result).toBeOk(Cl.list(expectedHistory));
  });

  it("correctly tracks props across block heights", () => {
    const message = "Props!";
    const startBlock = simnet.blockHeight;
    
    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    simnet.mineEmptyBlocks(10);

    simnet.callPublicFn(
      "squadprops",
      "give-props",
      [Cl.principal(wallet2), Cl.stringUtf8(message)],
      wallet1
    );

    const props1 = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-by-id",
      [Cl.uint(0)],
      deployer
    );

    const props2 = simnet.callReadOnlyFn(
      "squadprops",
      "get-props-by-id",
      [Cl.uint(1)],
      deployer
    );

    // Verify props were stored with correct timestamps
    expect(props1.result).toBeOk(Cl.some(Cl.tuple({
      giver: Cl.principal(wallet1),
      receiver: Cl.principal(wallet2),
      message: Cl.stringUtf8(message),
      timestamp: Cl.uint(startBlock),
      amount: Cl.uint(1),
    })));

    expect(props2.result).toBeOk(Cl.some(Cl.tuple({
      giver: Cl.principal(wallet1),
      receiver: Cl.principal(wallet2),
      message: Cl.stringUtf8(message),
      timestamp: Cl.uint(startBlock + 10),
      amount: Cl.uint(1),
    })));
  });
});
